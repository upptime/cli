import slugify from '@sindresorhus/slugify'
import {ensureDir, ensureFile, writeFile} from 'fs-extra'
import {join} from 'path'
import {getConfig} from './helpers/config'
import {infoErrorLogger} from './helpers/log'
import {getHistoryItems} from './helpers/calculate-response-time'
import dayjs from 'dayjs'
import {ChartJSNodeCanvas} from 'chartjs-node-canvas'

const canvasRenderService = new ChartJSNodeCanvas({width: 600, height: 400})
const chartOptions = {
  plugins: {
    legend: {display: false},
  },
  scales: {
    xAxes: {
      display: false,
      grid: {
        display: false,
      },
    },
    yAxes: {
      display: false,
      grid: {
        display: false,
      },
    },
  },
}

export const generateGraphs = async () => {
  infoErrorLogger.info('Generate Graphs')
  const config = await getConfig()

  await ensureDir(join('.', 'graphs'))

  for await (const site of config.sites) {
    const slug = slugify(site.name)
    if (!slug) continue

    const items = await getHistoryItems(slug)
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

    const tDay = responseTimes.filter(i => dayjs(i[0]).isAfter(dayjs().subtract(1, 'day')))
    const tWeek = responseTimes.filter(i => dayjs(i[0]).isAfter(dayjs().subtract(1, 'week')))
    const tMonth = responseTimes.filter(i => dayjs(i[0]).isAfter(dayjs().subtract(1, 'month')))
    const tYear = responseTimes.filter(i => dayjs(i[0]).isAfter(dayjs().subtract(1, 'year')))
    const dataItems: [string, [string, number][]][] = [
      [`${slug}/response-time-day.png`, tDay],
      [`${slug}/response-time-week.png`, tWeek],
      [`${slug}/response-time-month.png`, tMonth],
      [`${slug}/response-time-year.png`, tYear],
    ]

    for await (const dataItem of dataItems) {
      await ensureFile(join('.', 'graphs', dataItem[0]))
      await writeFile(
        join('.', 'graphs', dataItem[0]),
        await canvasRenderService.renderToBuffer({
          type: 'line',
          data: {
            labels: [1, ...dataItem[1].map(item => item[0]).reverse()],
            datasets: [
              {
                backgroundColor: '#89e0cf',
                borderColor: '#1abc9c',
                fill: true,
                data: [1, ...dataItem[1].map(item => item[1]).reverse()],
              },
            ],
          },
          options: chartOptions,
        })
      )
    }

    await ensureFile(join('.', 'graphs', slug, 'response-time.png'))
    await writeFile(
      join('.', 'graphs', slug, 'response-time.png'),
      await canvasRenderService.renderToBuffer({
        type: 'line',
        data: {
          labels: [1, ...responseTimes.map(item => item[0]).reverse()],
          datasets: [
            {
              backgroundColor: '#89e0cf',
              borderColor: '#1abc9c',
              fill: true,
              data: [1, ...responseTimes.map(item => item[1]).reverse()],
            },
          ],
        },
        options: chartOptions,
      })
    )
  }
}
