import {Command, flags} from '@oclif/command'
import {getConfig} from '../helpers/config'
import {UppConfig} from '../interfaces'
import {schedule} from 'node-cron'
import {curl} from '../helpers/request'

export default class Run extends Command {
static description = 'Run workflows'

static flags = {
  help: flags.help({char: 'h'}),
  // flag with a value (-n, --name=VALUE)
  // name: flags.string({char: 'n', description: 'name to print'}),
  // flag with no value (-f, --force)
  // force: flags.boolean({char: 'f'}),
}

// static args = [{name: 'file'}]

async run() {
  const config: UppConfig = await getConfig()
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  const performTestOnce = async (site: UppConfig['sites'][0]): Promise<{
    result: {
      httpCode: number;
    };
    status: 'up' | 'degraded' | 'down';
    responseTime: string;
  }> => {
    const result = await curl(site)
    const responseTime = (result.totalTime * 1000).toFixed(0)
    const expectedCodes = ([
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
    ]).map(Number)
    let status: 'up' | 'down' | 'degraded' = expectedCodes.includes(Number(result.httpCode)) ? 'up' : 'down'
    if (parseInt(responseTime, 10) >  60000) status = 'degraded'
    return {result, status, responseTime}
  }
  if (config.sites) {
    schedule(config.workflowSchedule?.updates ?? '*/20 * * * * *', async () => {
      for await (const site of config.sites) {
        let {result, responseTime, status} = await performTestOnce(site)
        if (status === 'down' || status === 'degraded') {
          wait(1000)
          const secondTry = await performTestOnce(site)
          if (secondTry.status === 'up') {
            result = secondTry.result
            responseTime = secondTry.responseTime
            status = secondTry.status
          } else {
            wait(10000)
            const thirdTry = await performTestOnce(site)
            if (thirdTry.status === 'up') {
              result = thirdTry.result
              responseTime = thirdTry.responseTime
              status = thirdTry.status
            }
          }
        }
        const logResult = ('$PREFIX $SITE_NAME is $STATUS ($RESPONSE_CODE in $RESPONSE_TIME ms) [upptime]')
        .replace(
          '$PREFIX',
          status === 'up' ?
            '🟩' :
            status === 'degraded' ?
              '🟨' :
              '🟥'
        )
        .replace('$SITE_NAME',
          site.name
        )
        .replace('$STATUS',
          status
        )
        .replace(
          '$RESPONSE_CODE',
          result.httpCode.toString()
        )
        .replace(
          '$RESPONSE_TIME',
          responseTime
        )
        this.log(logResult)
      }
    })
  }

  // Experimenting env variables
  // const secret = '{'GH_PAT':'Yo'}'
  // const pwd: string = Buffer.from(execSync('pwd'), 'hex').toString('utf8')
  // execSync('export SECRETS_CONTEXT="haha"')
  // this.log(Buffer.from(execSync('echo $SECRETS_CONTEXT'), 'hex').toString('utf8'))
  // execSync(`npx -c run ${config.packages.response}`, {stdio: 'inherit'})
}
}
