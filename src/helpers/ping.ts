import {ping as tcpp} from 'tcp-ping'
import type {Options, Result} from 'tcp-ping'

/**
 * Promisified TCP pinging
 * @param options - tcpp.ping options
 */

export const ping = (options: Options) =>
  new Promise<Result>((resolve, reject) => {
    tcpp(options, (error, data) => {
      if (error) return reject(error)
      resolve(data)
    })
  })
