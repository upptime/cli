import slugify from '@sindresorhus/slugify'
import { appendFile, writeSync } from 'fs'
import {mkdirp, ensureDir, ensureFile, writeFile, writeFileSync, readFile} from 'fs-extra'
import {join} from 'path'
import {getConfig} from './config'
import {infoErrorLogger} from './log'
import {getHistoryItems} from './calculate-response-time'
import {cli} from 'cli-ux'
import chalk from 'chalk'
import dayjs from 'dayjs'


export const generateGraphs = async () => {
  cli.action.start('Running graphs workflow')
  infoErrorLogger.info('Generate Graphs') 
  const config = await getConfig()
  await mkdirp(join('.','history','response-data'))
  try{

  for await (const site of config.sites) {
    const slug = slugify(site.name)
    if (!slug) continue
    // console.log(slug)
    const items = await getHistoryItems(slug)
    // console.log(items)
    const responseTimes: [string, number][] = items
    .filter(
      item =>
        item.commit.message.includes(' in ') &&
          Number(item.commit.message.split(' in ')[1].split('ms')[0].trim()) !== 0 &&
          !isNaN(Number(item.commit.message.split(' in ')[1].split('ms')[0].trim()))
    )
    /**
       * Parse the commit message
       * @example "🟥 Broken Site is down (500 in 321 ms) [skip ci] [upptime]"
       * @returns [Date, 321] where Date is the commit date
       */
    .map(
      item =>
          [
            item.commit.author.date,
            parseInt(item.commit.message.split(' in ')[1].split('ms')[0].trim(), 10),
          ] as [string, number]
    )
    .filter(item => item[1] && !isNaN(item[1]))

    // creating separate files
    const tDay = responseTimes.filter(i => dayjs(i[0]).isAfter(dayjs().subtract(1, 'day')))
    const tWeek = responseTimes.filter(i => dayjs(i[0]).isAfter(dayjs().subtract(1, 'week')))
    const tMonth = responseTimes.filter(i => dayjs(i[0]).isAfter(dayjs().subtract(1, 'month')))
    const tYear = responseTimes.filter(i => dayjs(i[0]).isAfter(dayjs().subtract(1, 'year')))
    const dataItems: [string, [string, number][]][] = [
      [`${slug}/response-time-day.yml`, tDay],
      [`${slug}/response-time-week.yml`, tWeek],
      [`${slug}/response-time-month.yml`, tMonth],
      [`${slug}/response-time-year.yml`, tYear],
    ]

    for await (const dataItem of dataItems) {
      await ensureFile(join('.', 'history', 'response-data' ,dataItem[0]))
      await writeFile(
        join('.', 'history', 'response-data' ,dataItem[0]), 
                [1, ...dataItem[1].map(item => item[1]).reverse()].toString().split(',').join('\n')
      )
    }
  }
  }
  catch(error){
    console.log(error)
    cli.action.stop(chalk.red('error'))
  }
  cli.action.stop(chalk.green('done'))
}