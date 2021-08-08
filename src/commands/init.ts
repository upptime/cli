import {Command} from '@oclif/command'

export default class Init extends Command {
  static description = 'initializes upptime'

  async run() {
    this.log('successfully initialized!')
  }
}
