import { Command } from '@oclif/command'
import { load } from 'js-yaml'
import { readFile } from 'fs-extra'
import { join } from 'path'
import { SiteHistory } from '../interfaces'
import { getConfig } from '../helpers/config'
import slugify from '@sindresorhus/slugify'
import chalk from 'chalk'

export default class Status extends Command {
  static description = 'updates about status of websites'

  async run() {
    const config = await getConfig()
    let i = 0
    for await (const site of config.sites) {
      const slug = site.slug || slugify(site.name)
      const currentStatus = 'unknown'
      const startTime = new Date()
      try {
        const data = load(
          (await readFile(join('.', 'history', `${slug}.yml`), 'utf8'))) as SiteHistory
        i++
        this.log(chalk.bgCyan.black('Site ', i))
        this.log('URL:', data.url)
        this.log('Status:', data.status, data.status === 'up' ? '🟩' : '🟥')
        this.log('CODE:', data.code)
        this.log('Response Time:', data.responseTime, '🕐')
        this.log('--------------------------------------------')
      } catch (error) {
        this.log('Current status', site.slug, currentStatus, startTime)
      }
    }
  }
}
