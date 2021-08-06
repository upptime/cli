// import {Command, flags} from '@oclif/command'
import {Command} from '@oclif/command'
// import global from 'browser'

export default class Docs extends Command {
  static description = 'redirects to Upptime docs'

  // static flags = {
  //   help: flags.help({char: 'h'}),
  //   // flag with a value (-n, --name=VALUE)
  //   name: flags.string({char: 'n', description: 'name to print'}),
  //   // flag with no value (-f, --force)
  //   force: flags.boolean({char: 'f'}),
  // }
  async run() {
    this.log('redirecting to https://upptime.js.org/')
    // this.ref('redirecting to https://upptime.js.org/')
    // window
    window.open('https://upptime.js.org/', '_blank')
    // run(['start https://upptime.js.org/'])
  }
}
