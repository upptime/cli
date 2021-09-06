export const getResponseTimeColor = (responseTime: number) =>
  responseTime === 0 ?
    'red' :
    responseTime < 200 ?
      'brightgreen' :
      responseTime < 400 ?
        'green' :
        responseTime < 600 ?
          'yellowgreen' :
          responseTime < 800 ?
            'yellow' :
            responseTime < 1000 ?
              'orange' :
              'red'

export const getUptimeColor = (uptime: string | number) => {
  if (typeof (uptime) === 'string')
    uptime = Number(uptime.split('%')[0])

  return   uptime > 95 ?
    'brightgreen' :
    uptime > 90 ?
      'green' :
      uptime > 85 ?
        'yellowgreen' :
        uptime > 80 ?
          'yellow' :
          uptime > 75 ?
            'orange' :
            'red'
}

