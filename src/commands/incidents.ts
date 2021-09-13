import Command from '../base'
import {getIncidents} from '../helpers/incidents'
import {cli} from 'cli-ux'
import chalk from 'chalk'

export default class Incidents extends Command {
  static description = 'reports all the incidents/downtimes'

  async run() {
    try {
      const _data = await getIncidents()
      Object.keys(_data).forEach(key => {
        const arr = []
        arr.push(_data[key].incidents)
        this.log(`${chalk.greenBright(_data[key].name)} ${_data[key].url}`)
        cli.table(arr[0], {
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
        this.log()
      })
    } catch (error) {
      this.log(chalk.bgYellow('No incidents as of now.'))
    }
  }
}
