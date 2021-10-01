import Command from '../base'
import {load} from 'js-yaml'
import {readFile} from 'fs-extra'
import {join} from 'path'
import {SiteStatus} from '../interfaces'
import {getConfig} from '../helpers/config'
import {cli} from 'cli-ux'
import slugify from '@sindresorhus/slugify'
import chalk from 'chalk'

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
        const data = Object.assign({}, _data, {
          idx: i,
        })
        arr.push(data)
      } catch (error) {
        this.log(chalk.red.inverse('No Status available'))
        this.log(chalk.blue('Please run the upp run command first'))
        break
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
