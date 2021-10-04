import Command from '../base'
import chalk from 'chalk'
import child_process from 'child_process'
import {flags} from '@oclif/command'
import * as inquirer from 'inquirer'

enum configOptions {
  ADD_NOTIFICATION, ADD_ENDPOINT, OPEN_EDITOR
}

export default class Config extends Command {
  static description = 'configures uclirc.yml';

  static flags = {
    help: flags.help({char: 'h', description: 'Show help for config cmd'}),
    // 'add-site': flags.string({char: 's', description: 'Add endpoint to monitor'}),
    // 'add-assignee': flags.boolean({char: 'q', description: 'Quiet'}),
  }

  async run() {
    // const {flags} = this.parse(Config)

    const responses: any = await inquirer.prompt([{
      name: 'action',
      message: 'select to config',
      type: 'list',
      choices: [{
        name: 'Add Notification provider', value: configOptions.ADD_ENDPOINT,
      }, {
        name: 'Add endpoint to monitor', value: configOptions.ADD_NOTIFICATION,
      }, {
        name: 'Other configurations (Open in editor)', value: configOptions.OPEN_EDITOR,
      }],
    }])
    const response = responses.action

    switch (response) {
    case configOptions.ADD_ENDPOINT:
      // Code to add a website
      break
    case configOptions.ADD_NOTIFICATION:
      // Ask which notification provider
      break
    case configOptions.OPEN_EDITOR:
      // Sakshi's spawn editor code, but make it platform aware
      this.spawnEditor()
      break
    }
  }

  spawnEditor() {
    const editor = process.env.EDITOR || 'vi'
    const child = child_process.spawn(editor, ['.uclirc.yml'], {
      stdio: 'inherit',
    })

    child.on('exit', (_code, _signal) => {
      if (_code === 0)
        this.log(chalk.green.inverse('Your upptime configured successfully!'))
      else
        this.log(chalk.red.inverse('Your upptime did not configure!'))
    })
  }
}
