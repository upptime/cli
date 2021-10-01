import {Logger} from 'winston'
import {stat} from 'fs-extra'
import {getIsLogColor, isLogColor} from './log-color'
const winston = require('winston')
const {format} = winston
const {label, combine, timestamp, printf, colorize} = format

const customLevels = {
  levels: {
    down: 0,
    error: 1,
    info: 2,
    degraded: 3,
    up: 4,
  },
  colors: {
    down: 'magenta',
    error: 'red',
    info: 'blue',
    degraded: 'yellow',
    up: 'green',
  },
}
winston.addColors(customLevels.colors)

export const printFormat = printf((info: {timestamp: string; level: string; message: string}) => {
  return `${info.timestamp} ${info.level}: ${info.message}`
})

export let statusLogger: { up: (arg0: string) => void; degraded: (arg0: string) => void; down: (arg0: string) => void }
export let infoErrorLogger: Logger
export const createLoggers = (async () => {
  // Check if .uclirc.yml exists, if it doesn't then return
  try {
    await stat('.uclirc.yml')
  } catch (_) {
    return
  }
  await getIsLogColor()
  infoErrorLogger = winston.loggers.add('infoError', {
    exitOnError: false,
    levels: customLevels.levels,
    format: combine(
      label({label: 'infoError'}),
      timestamp(),
      isLogColor ? colorize() : printFormat,
      printFormat
    ),
    transports: [
      new winston.transports.Console({level: 'error', format: colorize({all: true})}),
      new winston.transports.File({level: 'error', filename: 'error.log', colorize: false}),
      new winston.transports.File({level: 'info', filename: 'info.log', colorize: false}),
    ],
  })
  statusLogger = winston.loggers.add('status', {
    exitOnError: false,
    levels: customLevels.levels,
    format: combine(
      label({label: 'status'}),
      timestamp(),
      isLogColor ? colorize() : printFormat,
      printFormat
    ),
    transports: [
      new winston.transports.Console({level: 'down', format: colorize({all: true})}),
      new winston.transports.File({level: 'error', filename: 'error.log'}),
      new winston.transports.File({level: 'info', filename: 'info.log'}),
      new winston.transports.File({level: 'down', filename: 'down.log'}),
      new winston.transports.File({level: 'degraded', filename: 'degraded.log'}),
      new winston.transports.File({level: 'up', filename: 'status.log'}),
    ],
  })
})
