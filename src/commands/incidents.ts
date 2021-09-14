import Command from '../base'
import {getIncidents} from '../helpers/incidents'
import {cli} from 'cli-ux'
import chalk from 'chalk'
import {flags} from '@oclif/command'

export default class Incidents extends Command {
  static description = 'reports all the incidents/downtimes'

  static flags = {
    help: flags.help({char: 'h', description: 'Show help for run cmd'}),
    edit: flags.integer({char: 'e', name: 'edit', description: 'Edit an Issue'}),
  }

  async run() {
    try {
      const _data = (await getIncidents()).incidents
      const arr: any[] = []
      Object.keys(_data).forEach(key => {
        arr.push({id: key, ..._data[Number(key)]})
      })

      cli.table(arr, {
        id: {
          header: 'ID',
          minWidth: 7,
        },
        url: {
          header: 'Issue URL',
          minWidth: 10,
          get: row => row.url ?? '-',
        },
        status: {
          header: 'Status',
          minWidth: 7,
          get: row => row.status ?? '-',
        },
        createdAt: {
          header: 'Created At',
          minWidth: 10,
          get: row => new Date(row.createdAt).toLocaleString(),
        },
        closedAt: {
          header: 'Closed At',
          minWidth: 10,
          get: row => row.closedAt ?? '-',
        },
      }, {
        printLine: this.log,
      })
    } catch (error) {
      this.log(chalk.bgYellow('No incidents as of now.'))
    }
  }
}
