import { Command } from '@oclif/command'
import { load } from 'js-yaml'
import { readFile } from 'fs-extra'
import { join } from 'path'
import { SiteStatus } from '../interfaces'
import { getConfig } from '../helpers/config'
import { cli } from 'cli-ux'
import slugify from '@sindresorhus/slugify'

export default class Status extends Command {
  static description = 'updates about status of websites'

  async run() {
    const config = await getConfig()
    let i = 0
    const arr = []
    for await (const site of config.sites) {
      const slug = site.slug || slugify(site.name)
      try {
        const _data = load(
          (await readFile(join('.', 'history', `${slug}.yml`), 'utf8'))) as SiteStatus
        i++
        const data = Object.assign({ }, _data, {
          idx: i,
        })
        arr.push(data)
      } catch (error) {
        this.log('Current status not available, use run command first')
      }
    }
    cli.table(arr, {
      idx: {
        header: '',
      },
      url: {
        header: 'Website',
        minWidth: 7,
      },
      status: {
        header: 'Status',
        get: row => row.status === 'up' ? `${row.status} 🟩` : row.status === 'down' ? `${row.status} 🟥` : `${row.status} 🟨`,
        minWidth: 6,
      },
      code: {
        header: 'CODE',
        minWidth: 4,
      },
      responseTime: {
        header: 'Response Time',
        minWidth: 6,
      },
    }, {
      printLine: this.log,
    })
  }
}
