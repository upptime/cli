import {Command} from '@oclif/command'
export default class Status extends Command {
  static description = 'updates about status of websites'

  async run() {
    // need to make this dynamic
    this.log(`
Live status:
  Site:          overall uptime:	  response time:  
  Google.com     100%               149ms
  HackerNews     88%                339ms
  Wikipedia      96%                329ms
    `)
  }
}
