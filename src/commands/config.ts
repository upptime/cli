import Command from '../base'
import {shouldContinue} from '../helpers/should-continue'
import chalk from 'chalk'
import child_process from 'child_process'
import {flags} from '@oclif/command'
import inquirer from 'inquirer'

enum configOptions {
  ADD_NOTIFICATION, ADD_ENDPOINT, OPEN_EDITOR
}

export default class Config extends Command {
  static description = 'configures uclirc.yml';

  static flags = {
    help: flags.help({char: 'h', description: 'Show help for config cmd'}),
    'add-endpoint': flags.string({char: 'e', description: 'Add endpoint to monitor'}),
    'add-notification': flags.boolean({char: 'n', description: 'Quiet'}),
  }

  async run() {
    const {flags} = this.parse(Config)

    const shouldContinueObj = await shouldContinue()
    if (!shouldContinueObj.shouldContinue) {
      this.log(shouldContinueObj.message)
      return
    }

    let response: any

    if (Object.keys(flags).length === 0) {
      const responses: any = await inquirer.prompt([{
        name: 'action',
        message: 'select to config',
        type: 'list',
        choices: [{
          name: 'Add Notification provider', value: configOptions.ADD_NOTIFICATION,
        }, {
          name: 'Add endpoint to monitor', value: configOptions.ADD_ENDPOINT,
        }, {
          name: 'Other configurations (Open in editor)', value: configOptions.OPEN_EDITOR,
        }],
      }])
      response = responses.action
    } else if (flags['add-endpoint']) {
      response  = configOptions.ADD_ENDPOINT
    } else if (flags['add-notification']) {
      response  = configOptions.ADD_NOTIFICATION
    }

    switch (response) {
    case configOptions.ADD_ENDPOINT:
      // Code to add a website

      break
    case configOptions.ADD_NOTIFICATION:
      // Ask which notification provider

      break
    case configOptions.OPEN_EDITOR:
      this.spawnEditor()
      break
    }
  }

  // platform aware
  getPlatformDefaultEditor() {
    if (process.platform === 'win32')
      return 'notepad'
    // add more platforms
    return 'vi'
  }

  spawnEditor() {
    const editor = process.env.EDITOR || this.getPlatformDefaultEditor()
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
