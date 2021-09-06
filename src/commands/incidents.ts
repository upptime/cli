import { Command } from '@oclif/command'
import { load } from 'js-yaml'
import { readFile } from 'fs-extra'
import { Incident } from '../interfaces'
import { getIncidents } from '../helpers/incidents'
import { cli } from 'cli-ux'

export default class Incidents extends Command {
  static description = 'reports all the incidents/downtimes'

  async run() {
    
    const arr = []
    let i = 0
      try {
        const _data = load(
          (await readFile('incidents.yml', 'utf8'))) as Incident
        const data1 = Object.assign(_data.incidents)
        arr.push(data1)

        cli.table(arr[0], {
          name: {
            header: 'Name',
            minWidth: 7,
          },
          url: {
            header: 'url',
            minWidth: 7,
          },
          timestamp: {
            header: 'Timestamp',
            minWidth: 6,
          },
        }, {
          printLine: this.log,
        })

      } catch (error) {
        this.log('GG! no incidents as of now.')
      }
  }
}
