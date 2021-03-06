import Command from '../base'
import fs = require('fs')
import {prompt} from 'enquirer'
import chalk from 'chalk'
import {exec} from 'shelljs'

export default class Init extends Command {
  static description = 'initializes upptime';

  async run() {
    // user inputs for configuration
    function testForGit(this: any) {
      try {
        return exec('git rev-parse --is-inside-work-tree', {silent: true, encoding: 'utf8'}).code
      } catch (error) {
        this.log(error)
      }
    }

    const gitignoreData = `

# upptime log files
down.log
error.log
degraded.log
status.log
info.log`

    if (testForGit() !== 0) {
      this.log(chalk.bgRed('Directory is not git initialised'))
    } else if (fs.existsSync('.uclirc.yml')) {
      this.log(chalk.red('❌ Already Initialized'))
    } else {
      if (fs.existsSync('.gitignore')) {
        fs.appendFileSync('.gitignore', gitignoreData)
      } else {
        fs.writeFileSync('.gitignore', gitignoreData)
      }
      const response: {name: string; url: string} = await prompt([
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
      const fileData = `sites:
  - name: ${response.name}
    url: ${response.url}`
      fs.writeFileSync('.uclirc.yml', fileData)
      // generate a new .yml file or modify/append new data
      this.log(chalk.green.inverse('✅ initialized successfully'))
    }
  }
}
