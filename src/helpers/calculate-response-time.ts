import dayjs from 'dayjs'
import {exec} from 'shelljs'
import {Downtimes} from '../interfaces'
import {getConfig} from './config'
import {infoErrorLogger} from './log'

/** Calculate the average of some numbers */

const avg = (array: number[]) => (array.length > 0 ? array.reduce((a, b) => a + b) / array.length : 0)

/** Get commits for a history file */

export const getHistoryItems = async (
  slug: string,
) => {
  const results = exec(`git log --pretty=format:"%h%x09%ad%x09%s" --date=default  --all --first-parent --author-date-order -- ./history/${slug}.yml`, {silent: true}).stdout.split('\n')
  const data = results.map(item => {
    const info = item.split('\t')
    return {
      commit: {
        message: info[2],
        author: {
          date: info[1],
        },
      },
    }
  })
  if (!data[0]) return []
  return data
}

export const getResponseTimeForSite = async (
  slug: string
): Promise<Omit<Downtimes & { currentStatus: 'up' | 'down' | 'degraded' }, 'dailyMinutesDown'>> => {
  const config = await getConfig()
  const data = await getHistoryItems(slug)
  const responseTimes: [string, number][] = data
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
          (item.commit.author || {}).date,
          parseInt(item.commit.message.split(' in ')[1].split('ms')[0].trim(), 10),
        ] as [string, number]
  )
  .filter(item => item[1] && !isNaN(item[1]))

  const daySum: number[] = responseTimes
  .filter(i => dayjs(i[0]).isAfter(dayjs().subtract(1, 'day')))
  .map(i => i[1])
  const weekSum: number[] = responseTimes
  .filter(i => dayjs(i[0]).isAfter(dayjs().subtract(1, 'week')))
  .map(i => i[1])
  const monthSum: number[] = responseTimes
  .filter(i => dayjs(i[0]).isAfter(dayjs().subtract(1, 'month')))
  .map(i => i[1])
  const yearSum: number[] = responseTimes
  .filter(i => dayjs(i[0]).isAfter(dayjs().subtract(1, 'year')))
  .map(i => i[1])
  const allSum: number[] = responseTimes.map(i => i[1])
  infoErrorLogger.info(`weekSum,  ${weekSum}, ${avg(weekSum)}`)

  // Current status is "up", "down", or "degraded" based on the emoji prefix of the commit message
  const currentStatus: 'up' | 'down' | 'degraded' = data[0] ?
    data[0].commit.message.split(' ')[0].includes(config.commitPrefixStatusUp || '🟩') ?
      'up' :
      data[0].commit.message.split(' ')[0].includes(config.commitPrefixStatusDegraded || '🟨') ?
        'degraded' :
        'down' :
    'up'

  return {
    day: Math.round(avg(daySum) || 0),
    week: Math.round(avg(weekSum) || 0),
    month: Math.round(avg(monthSum) || 0),
    year: Math.round(avg(yearSum) || 0),
    all: Math.round(avg(allSum) || 0),
    currentStatus,
  }
}
