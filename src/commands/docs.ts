import {Command} from '@oclif/command'
import cli from  'cli-ux'
export default class Docs extends Command {
  static description = 'redirects to Upptime docs'

  async run() {
    this.log('redirecting to https://upptime.js.org/')
    cli.open('https://upptime.js.org/')
  }
}
