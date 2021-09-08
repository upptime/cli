/* eslint-disable complexity */

import slugify from '@sindresorhus/slugify'
import {mkdirp, readFile, writeFile} from 'fs-extra'
import {load} from 'js-yaml'
import {join} from 'path'
import {getConfig} from './helpers/config'
// import {replaceEnvironmentVariables} from './helpers/environment'
import {commit, push} from './helpers/git'
import {infoErrorLogger} from './helpers/log'
import {ping} from './helpers/ping'
import {curl} from './helpers/request'
import {SiteHistory} from './interfaces'
import {generateSummary} from './summary'
import cli from 'cli-ux'
import chalk from 'chalk'

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
export const update = async (shouldCommit = false) => {
// !! DIFF:: not checking if the .yml is valid, missing shouldContinue()
  cli.action.start(`Running ${shouldCommit ? 'response-time' : 'update'} workflow`)
  await mkdirp('history')

  const config = await getConfig()
  let hasDelta = false

  for await (const site of config.sites) {
    infoErrorLogger.info(`Checking ${site.url}`)
    const slug = site.slug || slugify(site.name)
    let currentStatus = 'unknown'
    let startTime = new Date()
    try {
      const siteHistory = load(
        (await readFile(join('.', 'history', `${slug}.yml`), 'utf8'))
        .split('\n')
        .map(line => (line.startsWith('- ') ? line.replace('- ', '') : line))
        .join('\n')
      ) as SiteHistory
      currentStatus = siteHistory.status || 'unknown'
      startTime = new Date(siteHistory.startTime || new Date())
    } catch (error) {}
    infoErrorLogger.info(`Current status ${site.slug} ${currentStatus} ${startTime}`)

    /**
     * Check whether the site is online
     */
    const performTestOnce = async (): Promise<{
      result: {
        httpCode: number;
      };
      responseTime: string;
      status: 'up' | 'down' | 'degraded';
    }> => {
      if (site.check === 'tcp-ping') {
        infoErrorLogger.info('Using tcp-ping instead of curl')
        try {
          let status: 'up' | 'down' | 'degraded' = 'up'
          const tcpResult = await ping({
            // address: replaceEnvironmentVariables(site.url),
            // port: Number(replaceEnvironmentVariables(site.port ? String(site.port) : '')),
            address: site.url,
            attempts: 5,
            port: Number(site.port),
          })
          if (tcpResult.avg > (site.maxResponseTime || 60000)) status = 'degraded'
          infoErrorLogger.info(`Got result ${tcpResult}`)
          return {
            result: {httpCode: 200},
            responseTime: (tcpResult.avg || 0).toFixed(0),
            status,
          }
        } catch (error) {
          infoErrorLogger.info(`Got pinging error ${error}`)
          return {result: {httpCode: 0}, responseTime: (0).toFixed(0), status: 'down'}
        }
      } else {
        const result = await curl(site)
        infoErrorLogger.info(`Result from test ${result.httpCode} ${result.totalTime}`)
        const responseTime = (result.totalTime * 1000).toFixed(0)
        const expectedStatusCodes = (
          site.expectedStatusCodes || [
            200,
            201,
            202,
            203,
            200,
            204,
            205,
            206,
            207,
            208,
            226,
            300,
            301,
            302,
            303,
            304,
            305,
            306,
            307,
            308,
          ]
        ).map(Number)
        let status: 'up' | 'down' | 'degraded' = expectedStatusCodes.includes(
          Number(result.httpCode)
        ) ?
          'up' :
          'down'
        if (parseInt(responseTime, 10) > (site.maxResponseTime || 60000)) status = 'degraded'
        if (status === 'up' && typeof result.data === 'string') {
          if (site.__dangerous__body_down && result.data.includes(site.__dangerous__body_down))
            status = 'down'
          if (
            site.__dangerous__body_degraded &&
            result.data.includes(site.__dangerous__body_degraded)
          )
            status = 'degraded'
        }
        if (
          site.__dangerous__body_degraded_if_text_missing &&
          !result.data.includes(site.__dangerous__body_degraded_if_text_missing)
        )
          status = 'degraded'
        if (
          site.__dangerous__body_down_if_text_missing &&
          !result.data.includes(site.__dangerous__body_down_if_text_missing)
        )
          status = 'down'
        return {result, responseTime, status}
      }
    }

    let {result, responseTime, status} = await performTestOnce()
    /**
     * If the site is down, we perform the test 2 more times to make
     * sure that it's not a false alarm
     */
    if (status === 'down' || status === 'degraded') {
      wait(1000)
      const secondTry = await performTestOnce()
      if (secondTry.status === 'up') {
        result = secondTry.result
        responseTime = secondTry.responseTime
        status = secondTry.status
      } else {
        wait(10000)
        const thirdTry = await performTestOnce()
        if (thirdTry.status === 'up') {
          result = thirdTry.result
          responseTime = thirdTry.responseTime
          status = thirdTry.status
        }
      }
    }

    try {
      if (shouldCommit || currentStatus !== status) {
        await writeFile(
          join('.', 'history', `${slug}.yml`),
          `url: ${site.url}
status: ${status}
code: ${result.httpCode}
responseTime: ${responseTime}
lastUpdated: ${new Date().toISOString()}
startTime: ${startTime}
generator: Upptime <https://github.com/upptime/upptime>
`
        )
        commit(
          (
            (config.commitMessages || {}).statusChange ||
            '$PREFIX $SITE_NAME is $STATUS ($RESPONSE_CODE in $RESPONSE_TIME ms) [skip ci] [upptime]'
          )
          .replace(
            '$PREFIX',
            status === 'up' ?
              config.commitPrefixStatusUp || '🟩' :
              status === 'degraded' ?
                config.commitPrefixStatusDegraded || '🟨' :
                config.commitPrefixStatusDown || '🟥'
          )
          .replace('$SITE_NAME', site.name)
          .replace('$SITE_URL', site.url)
          .replace('$SITE_METHOD', site.method || 'GET')
          .replace('$STATUS', status)
          .replace('$RESPONSE_CODE', result.httpCode.toString())
          .replace('$RESPONSE_TIME', responseTime),
          (config.commitMessages || {}).commitAuthorName,
          (config.commitMessages || {}).commitAuthorEmail
        )
        if (currentStatus === status) {
          infoErrorLogger.info(`Status is the same ${currentStatus} ${status}`)
        } else {
          infoErrorLogger.info(`Status is different ${currentStatus} to ${status}`)
          hasDelta = true
        }
      } else {
        infoErrorLogger.info(`Skipping commit, status is ${status}`)
      }
    } catch (error) {
      cli.action.stop(chalk.red('error'))
      infoErrorLogger.error(`${error}`)
    }
  }
  if (config.commits?.provider && config.commits?.provider === 'GitHub')
    push()
  cli.action.stop(chalk.green('done'))
  if (hasDelta) generateSummary()
}
