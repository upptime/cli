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
    columns: flags.string({exclusive: ['additional'], description: 'only show provided columns (comma-separated)'}),
    sort: flags.string({description: 'property to sort by (prepend \'-\' for descending)'}),
    filter: flags.string({description: 'filter property by partial string matching, ex: name=foo'}),
    csv: flags.boolean({exclusive: ['no-truncate'], description: 'output is csv format'}),
    extended: flags.boolean({char: 'x', description: 'show extra columns'}),
    'no-truncate': flags.boolean({exclusive: ['csv'], description: 'do not truncate output to fit screen'}),
    'no-header': flags.boolean({exclusive: ['csv'], description: 'hide table header from output'}),
  }

  async run() {
    const {flags} = this.parse(Incidents)
    try {
      const _data = (await getIncidents()).incidents
      const arr: any[] = []
      Object.keys(_data).forEach(key => {
        arr.push({id: key, ..._data[Number(key)]})
      })

      const options = {
        printLine: this.log,
        columns: flags.columns,
        sort: flags.sort,
        filter: flags.filter,
        csv: flags.csv,
        extended: flags.extended,
        'no-truncate': flags['no-truncate'],
        'no-header': flags['no-header'],
      }

      cli.table(arr, {
        id: {
          header: 'ID',
          minWidth: 7,
        },
        url: {
          header: 'Issue URL',
          minWidth: 10,
          extended: true,
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
      }, options)
    } catch (error) {
      this.log(chalk.bgYellow('No incidents as of now.'))
    }
  }
}
