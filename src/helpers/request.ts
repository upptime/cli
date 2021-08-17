import {Curl} from 'node-libcurl'

export const curl = (siteUrl: string): Promise<{httpCode: number; totalTime: number; data: string}> => new Promise(resolve => {
  const method = 'GET'
  const curl = new Curl()
  curl.setOpt('URL', siteUrl)
  curl.setOpt('FOLLOWLOCATION', 1)
  curl.setOpt('MAXREDIRS', 3)
  curl.setOpt('USERAGENT', 'Pabio Bot')
  curl.setOpt('CONNECTTIMEOUT', 10)
  curl.setOpt('TIMEOUT', 30)
  curl.setOpt('HEADER', 1)
  curl.setOpt('VERBOSE', false)
  curl.setOpt('CUSTOMREQUEST', method)
  curl.on('error', () => {
    curl.close()
    // console.log('Got an error (on error)', error)
    return resolve({httpCode: 0, totalTime: 0, data: ''})
  })

  curl.on('end', (_, data) => {
    if (typeof data !== 'string') data = data.toString()
    let httpCode = 0
    let totalTime = 0
    try {
      httpCode = Number(curl.getInfo('RESPONSE_CODE'))
      totalTime = Number(curl.getInfo('TOTAL_TIME'))
    } catch (error) {
      curl.close()
      // console.log("Got an error (on end)", error);
      return resolve({httpCode, totalTime, data})
    }
    // if (httpCode === 0 || totalTime === 0) console.log("Didn't get an error but got 0s");
    return resolve({httpCode, totalTime, data})
  })
  curl.perform()
})
