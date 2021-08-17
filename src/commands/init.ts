import { Command } from '@oclif/command'
import fs = require('fs')
import { prompt } from 'enquirer'
import chalk = require('chalk')

export default class Init extends Command {
  static description = 'initializes upptime';

  async run() {
    // user inputs for configuration
    if (fs.existsSync('.uclirc.yml')) {
      this.log(chalk.red('❌ Already Initialized'))
    } else {
      const response = await prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter site name?',
        },
        {
          type: 'input',
          name: 'url',
          message: 'Enter site url?',
        },
      ])
      // .yml file data to put, taken from the user
      const fileData = `site name: ${response.name}
site url: ${response.url}`
      fs.writeFileSync('.uclirc.yml', fileData)
      // generate a new .yml file or modify/append new data
      this.log(chalk.green.inverse('✅ initialized successfully'))
    }
  }
}
