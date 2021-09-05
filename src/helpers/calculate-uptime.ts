import {readFile} from 'fs-extra'
import {load} from 'js-yaml'
import {join} from 'path'
import {DownPecentages, Downtimes, SiteHistory} from '../interfaces'
import {infoErrorLogger} from './log'

/**
 * Get the number of seconds a website has been down
 * @param slug - Slug of the site
 */

const getDowntimeSecondsForSite = async (slug: string): Promise<Downtimes> => {
  const day = 0
  const week = 0
  const month = 0
  const year = 0
  const all = 0
  const dailyMinutesDown: Record<string, number> = {}

  // TODO get issues and calculate downtimes
  infoErrorLogger.info(`down time: ${slug}`)

  return {
    day: Math.round(day / 1000),
    week: Math.round(week / 1000),
    month: Math.round(month / 1000),
    year: Math.round(year / 1000),
    all: Math.round(all / 1000),
    dailyMinutesDown,
  }
}

/**
 * Get the uptime percentage for a website
 * @returns Percent string, e.g., 94.43%
 * @param slug - Slug of the site
 */

export const getUptimePercentForSite = async (slug: string): Promise<DownPecentages> => {
  const site = load(
    (await readFile(join('.', 'history', `${slug}.yml`), 'utf8'))
    .split('\n')
    .map(line => (line.startsWith('- ') ? line.replace('- ', '') : line))
    .join('\n')
  ) as SiteHistory
  // Time when we started tracking this website's downtime
  const startDate = new Date(site.startTime || new Date())

  // Number of seconds we have been tracking this site
  const totalSeconds = (new Date().getTime() - startDate.getTime()) / 1000

  // Number of seconds the site has been down
  const downtimeSeconds = await getDowntimeSecondsForSite(slug)

  // Return a percentage string
  return {
    day: `${Math.max(0, 100 - ((downtimeSeconds.day / Math.min(86400, totalSeconds)) * 100)).toFixed(
      2
    )}%`,
    week: `${Math.max(
      0,
      100 - ((downtimeSeconds.week / Math.min(604800, totalSeconds)) * 100)
    ).toFixed(2)}%`,
    month: `${Math.max(
      0,
      100 - ((downtimeSeconds.month / Math.min(2628288, totalSeconds)) * 100)
    ).toFixed(2)}%`,
    year: `${Math.max(
      0,
      100 - ((downtimeSeconds.year / Math.min(31536000, totalSeconds)) * 100)
    ).toFixed(2)}%`,
    all: `${Math.max(0, 100 - ((downtimeSeconds.all / totalSeconds) * 100)).toFixed(2)}%`,
    dailyMinutesDown: downtimeSeconds.dailyMinutesDown,
  }
}
