/* eslint-disable max-depth */
import slugify from '@sindresorhus/slugify'
import {getConfig} from './config'
import {readFile} from 'fs-extra'
import {join} from 'path'
import cli from 'cli-ux'
import chalk from 'chalk'
import {infoErrorLogger} from './log'

// Error.stackTraceLimit = Infinity;
export const Dayvalues = async (slug = '') => {
  const values = []
  try {
    const config = await getConfig()
    const exists = config.sites.map(ob => Boolean(ob.slug === `${slug}` || slugify(ob.name) === `${slug}`))
    if (exists.includes(true)) {
      // change structure before push
      const daysArray = (await readFile(join('.', 'history', 'response-data', `${slug.toLowerCase()}`, 'response-time-day.yml'), 'utf8')).split('\n')
      const num = daysArray.length

      if (num < 5 + 1) {
        for (let i = 1; i < num; i++) {
          const element = Number(daysArray[i])
          values.push(element)
        }
      } else {
        // var testArray = ['100','200','300','700','150','220','350','780','190','210','360','600']
        // num = testArray.length
        let count = 0
        const interval = Math.floor(num / 5)
        let sum = 0
        for (let i = 1; i < num + 1; i++) {
          if (count >= interval) {
            values.push(Math.floor(sum / interval))
            sum = 0
            count = 0
          }
          const element = Number(daysArray[i])
          sum += element
          count++
        }
      }
    } else {
      throw Error
    }
  } catch (error) {
    infoErrorLogger.error(error)
    // output message
    cli.action.stop(chalk.red('Some issue fetching response time data'))
  }
  // return array
  infoErrorLogger.info(`day ,${values}`)
  return values
}

export const Weekvalues = async (slug = '') => {
  const values = []
  try {
    const config = await getConfig()
    const exists = config.sites.map(ob => ob.name === `${slug}`)
    if (exists.includes(true)) {
      // change structure before push
      const daysArray = (await readFile(join('.', 'history', 'response-data', `${slug.toLowerCase()}`, 'response-time-week.yml'), 'utf8')).split('\n')
      const num = daysArray.length

      if (num < 7 + 1) {
        for (let i = 1; i < num; i++) {
          const element = Number(daysArray[i])
          values.push(element)
        }
      } else {
        let count = 0
        const interval = Math.floor(num / 7)
        let sum = 0
        for (let i = 1; i < num + 1; i++) {
          if (count >= interval) {
            values.push(Math.floor(sum / interval))
            sum = 0
            count = 0
          }
          const element = Number(daysArray[i])
          sum += element
          count++
        }
      }
    } else {
      throw Error
    }
  } catch (error) {
    infoErrorLogger.error(error)
    // output message
    cli.action.stop(chalk.red('Some issue fetching response time data'))
  }
  // return array
  infoErrorLogger.info(`week , ${values}`)
  return values
}

export const Monthvalues = async (slug = '') => {
  const values = []
  try {
    const config = await getConfig()

    const exists = config.sites.map(ob => ob.name.toLowerCase() === `${slug.toLowerCase()}`)
    if (exists.includes(true)) {
      // change structure before push
      const daysArray = (await readFile(join('.', 'history', 'response-data', `${slug.toLowerCase()}`, 'response-time-month.yml'), 'utf8')).split('\n')

      const num = daysArray.length

      if (num < 10 + 1) {
        for (let i = 1; i < num; i++) {
          const element = Number(daysArray[i])
          values.push(element)
        }
      } else {
        let count = 0
        const interval = Math.floor(num / 10)
        let sum = 0
        for (let i = 1; i < num + 1; i++) {
          if (count >= interval) {
            values.push(Math.floor(sum / interval))
            sum = 0
            count = 0
          }
          const element = Number(daysArray[i])
          sum += element
          count++
        }
      }
    } else {
      throw Error
    }
  } catch (error) {
    infoErrorLogger.error(error)
    // output message
    cli.action.stop(chalk.red('Some issue fetching response time data'))
  }
  // return array
  infoErrorLogger.info(`month , ${values}`)
  return values
}

export const Yearvalues = async (slug = '') => {
  const values = []
  try {
    const config = await getConfig()
    const exists = config.sites.map(ob => ob.name === `${slug}`)
    if (exists.includes(true)) {
      // change structure before push
      const daysArray = (await readFile(join('.', 'history', 'response-data', `${slug.toLowerCase()}`, 'response-time-year.yml'), 'utf8')).split('\n')
      const num = daysArray.length

      if (num < 12 + 1) {
        for (let i = 1; i < num; i++) {
          const element = Number(daysArray[i])
          values.push(element)
        }
      } else {
        let count = 0
        const interval = Math.floor(num / 12)
        let sum = 0
        for (let i = 1; i < num + 1; i++) {
          if (count >= interval) {
            values.push(Math.floor(sum / interval))
            sum = 0
            count = 0
          }
          const element = Number(daysArray[i])
          sum += element
          count++
        }
      }
    } else {
      throw Error
    }
  } catch (error) {
    infoErrorLogger.error(error)
    // output message
    cli.action.stop(chalk.red('Some issue fetching response time data'))
  }
  // return array
  infoErrorLogger.info('year ', values)
  return values
}

