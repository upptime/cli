import { Command } from '@oclif/command'
import fs = require('fs')
import { cli } from 'cli-ux'
import chalk = require('chalk')

export default class Init extends Command {
  static description = 'initializes upptime';

  async run() {
    // user inputs for configuration
    if (fs.existsSync('.uclirc.yml')) {
      this.log(chalk.red('❌ Already Initialized'))
    } else {
      const site_name = await cli.prompt('Enter the site name')
      const site_url = await cli.prompt('Enter the site url')
      // .yml file data to put, taken from the user
      const fileData = `site name: ${site_name}
site url: ${site_url}`
      fs.writeFileSync('.uclirc.yml', fileData)
      // generate a new .yml file or modify/append new data
      this.log(chalk.green.inverse('✅ initialized successfully'))
    }
  }
}
