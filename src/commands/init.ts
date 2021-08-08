import {Command} from '@oclif/command'
const fs = require('fs')

export default class Init extends Command {
  static description = 'initializes upptime'

  async run() {
    fs.writeFileSync('uclirc.yaml', 'owner: upptime')
    this.log('successfully initialized!')
  }
}
