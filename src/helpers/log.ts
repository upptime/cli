const winston = require('winston')
const {format} = winston
const {label, combine, timestamp, printf, colorize} = format

const customLevels = {
  levels: {
    down: 0,
    error: 1,
    info: 2,
    up: 3,
  },
  colors: {
    down: 'magenta',
    error: 'red',
    info: 'blue',
    up: 'green',
  },
}
winston.addColors(customLevels.colors)

export const printFormat = printf((info: {timestamp: string; level: string; message: string}) => {
  return `${info.timestamp} ${info.level}: ${info.message}`
})

export const statusLogger = winston.loggers.add('status', {
  exitOnError: false,
  levels: customLevels.levels,
  format: combine(
    label({label: 'status'}),
    timestamp(),
    printFormat
  ),
  transports: [
    new winston.transports.Console({level: 'down', format: colorize({all: true})}),
    new winston.transports.File({level: 'error', filename: 'error.log'}),
    new winston.transports.File({level: 'info', filename: 'info.log'}),
    new winston.transports.File({level: 'down', filename: 'down.log'}),
    new winston.transports.File({level: 'up', filename: 'status.log'}),
  ],
})

export const infoErrorLogger = winston.loggers.add('infoError', {
  exitOnError: false,
  levels: customLevels.levels,
  format: combine(
    label({label: 'infoError'}),
    timestamp(),
    printFormat,
  ),
  transports: [
    new winston.transports.Console({level: 'error', format: colorize({all: true})}),
    new winston.transports.File({level: 'error', filename: 'error.log', colorize: false}),
    new winston.transports.File({level: 'info', filename: 'info.log', colorize: false}),
  ],
})
