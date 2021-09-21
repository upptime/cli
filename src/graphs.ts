import slugify from '@sindresorhus/slugify'
import { appendFile } from 'fs'
import {mkdirp, ensureDir, ensureFile, writeFile, writeFileSync} from 'fs-extra'
import {join} from 'path'
import {getConfig} from './helpers/config'
import {infoErrorLogger} from './helpers/log'
import {getHistoryItems} from './helpers/calculate-response-time'
import {cli} from 'cli-ux'
import chalk from 'chalk'


export const generateGraphs = async () => {
  console.log("in")
  cli.action.start('Running graphs workflow')
  infoErrorLogger.info('Generate Graphs')
  const config = await getConfig()
  await mkdirp('history')
  try{

  for await (const site of config.sites) {
    const slug = slugify(site.name)
    if (!slug) continue
    console.log(slug)
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
     await writeFile(join('.', 'history','response-data', `${slug}.yml`), '')


    // appending response times to those files
    for await (const dataItem of responseTimes) {
      console.log(dataItem[1])
    //   // plotting graph logic to be added here.

    //   // way to store the data
    }
    
  }

  }
  catch(error){
    cli.action.stop(chalk.red('error'))
  }
  cli.action.stop(chalk.green('done'))
}
