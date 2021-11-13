import Command from '../base'
import {shouldContinue} from '../helpers/should-continue'
import chalk from 'chalk'
import child_process from 'child_process'
import {prompt} from 'enquirer'
import {flags} from '@oclif/command'
import {addToEnv, getFromEnv, notificationsProviderGroup, possibleEnvVariables, ProviderTypes} from '../helpers/update-env-file'
import {getSecret} from '../helpers/secrets'
// import {getConfig} from '../helpers/config'

const {AutoComplete, Select} = require('enquirer')

enum ConfigOptions {
  ADD_ENVIRONMENT_VARIABLE='ADD_ENVIRONMENT_VARIABLE', ADD_NOTIFICATION_PROVIDER='ADD_NOTIFICATION_PROVIDER', ADD_SITE='ADD_SITE', OPEN_EDITOR='OPEN_EDITOR', OPEN_TEMPLATE='OPEN_TEMPLATE'
}

enum Code {
  SUCCESS=0, USER_ABORT=-1
}

export default class Config extends Command {
  static description = 'configures uclirc.yml';

  static flags = {
    help: flags.help({char: 'h', description: 'Show help for config cmd'}),
    // 'add-site': flags.string({char: 's', description: 'Add site url to monitor'}),
    'add-env-variable': flags.boolean({char: 'e', description: 'Add/edit environment variable'}),
    'add-notification-provider': flags.boolean({char: 'n', description: 'Add/edit environment variables particular to a notification provider'}),
    'open-editor': flags.boolean({char: 'o', description: 'Open in editor'}),
    // 'open-template': flags.boolean({char: 't', description: 'Open template to edit'}),
  }

  async run() {
    const {flags} = this.parse(Config)

    const shouldContinueObj = await shouldContinue()
    if (!shouldContinueObj.continue) {
      this.log(shouldContinueObj.message)
      return
    }

    let response: any

    if (Object.keys(flags).length === 0) {
      try {
        const question = new Select({
          name: 'action',
          message: 'Select config option:',
          choices: [{
            name: 'Add/edit environment variable', value: ConfigOptions.ADD_ENVIRONMENT_VARIABLE,
          }, {
            name: 'Add/edit notification provider', value: ConfigOptions.ADD_NOTIFICATION_PROVIDER,
          }, {
          //   name: 'Add site url to monitor', value: ConfigOptions.ADD_SITE,
          // }, {
            name: 'Other configurations (Open in editor)', value: ConfigOptions.OPEN_EDITOR,
          // }, {
            // name: 'Other configurations (Open template)', value: ConfigOptions.OPEN_TEMPLATE,
          }],
          result(names: any) {
            return this.map(names)
          },
        })
        response = Object.values(await question.run())[0]
      } catch (error) {
        this.exitMessage(Code.USER_ABORT)
        return
      }
    } else if (flags['add-env-variable']) response  = ConfigOptions.ADD_ENVIRONMENT_VARIABLE
    else if (flags['add-notification-provider']) response = ConfigOptions.ADD_NOTIFICATION_PROVIDER
    else if (flags['open-editor']) response = ConfigOptions.OPEN_EDITOR
    // else if (flags['open-template']) response = ConfigOptions.OPEN_TEMPLATE
    // else if (flags['add-site']) response  = ConfigOptions.ADD_SITE

    switch (response) {
    // case ConfigOptions.ADD_SITE:
    //   // Code to add a website
    //   break
    case ConfigOptions.ADD_NOTIFICATION_PROVIDER:
      await this.addNotificationProvider()
      break
    case ConfigOptions.ADD_ENVIRONMENT_VARIABLE:
      await this.addEnvironmentVariable()
      break
    case ConfigOptions.OPEN_EDITOR:
      this.spawnEditor()
      break
    // case ConfigOptions.OPEN_TEMPLATE:
    //   this.configTemplate()
    //   break
    }
  }

  async addNotificationProvider() {
    const providerTypes = Object.values(ProviderTypes).map(val => {
      return {name: val}
    })
    const questionType = new Select({
      name: 'providerType',
      message: 'Select notification provider type:',
      choices: providerTypes,
    })
    const providerType = await questionType.run()

    const providers = Object.keys(notificationsProviderGroup)
    .filter(key => notificationsProviderGroup[key].type === providerType)
    .map(key => {
      return {
        name: notificationsProviderGroup[key].name,
        value: key,
      }
    })

    const questionProvider = new Select({
      name: 'provider',
      message: 'Select notification provider:',
      choices: providers,
      result(names: any) {
        return this.map(names)
      },
    })
    const provider = Object.values(await questionProvider.run())[0] as string
    const providerObj = notificationsProviderGroup[provider]

    /* Add dependsOn only if previously not set, it becomes tedious if user has to input
    multiple providers of same type */
    let listOfVariables: string[] = []
    if (providerObj.dependsOn && !providerObj.dependsOn.every(key => getSecret(key)))
      listOfVariables = listOfVariables.concat(providerObj.dependsOn)
    listOfVariables = listOfVariables.concat(providerObj.variables)

    for await (const key of listOfVariables) {
      const originalValue = getFromEnv(key)
      const value: {env_variable_value: string} = await prompt({
        name: 'env_variable_value',
        type: 'input',
        message: originalValue ? `${key} (${originalValue}):` : `${key}:`,
      })
      if (value.env_variable_value) addToEnv(key, value.env_variable_value)
    }
  }

  async addEnvironmentVariable() {
    const question = new AutoComplete({
      name: 'env_variable',
      message: 'Select environment variable?',
      choices: possibleEnvVariables,
      limit: 7,
    })
    const key = await question.run()
    const originalValue = getFromEnv(key)
    const value: {env_variable_value: string} = await prompt({
      name: 'env_variable_value',
      type: 'input',
      message: originalValue ? `Value (${originalValue}):` : 'Value:',
    })
    if (value.env_variable_value) addToEnv(key, value.env_variable_value)
  }

  // platform aware
  getPlatformDefaultEditor() {
    let editor = null
    switch (process.platform) {
    case 'win32': // though Wordpad is the default, I feel generally users prefer notepad
      editor = 'notepad'
      break
    case 'aix':
    case 'linux':
    case 'darwin':
    case 'freebsd':
    case 'sunos':
    case 'openbsd':
      editor = 'vi'
      break
    }
    return editor
  }

  exitMessage(code: number | null) {
    if (code === 0)
      this.log(chalk.green.inverse('Your upptime configured successfully!'))
    else if (code === Code.USER_ABORT)
      this.log(chalk.bgRed.white('Aborted! User generated interrupt'))
    else
      this.log(chalk.red.inverse('Your upptime did not configure!'))
  }

  spawnEditor() {
    const editor = process.env.EDITOR || this.getPlatformDefaultEditor()
    if (editor === null) {
      this.log('Set "EDITOR" env variable to open your favorite editor')
      return
    }
    const child = child_process.spawn(editor, ['.uclirc.yml'], {
      stdio: 'inherit',
    })
    child.on('exit', (_code, _signal) => {
      this.exitMessage(_code)
    })
  }

  // async configTemplate() {
  //   const config = await getConfig()
  //   const snippet = new Snippet({
  //     name: 'config',
  //     message: 'Fill out the fields in uclirc.yaml',
  //     template: config.toString(),
  //   })

  //   snippet.run()
  //   .then((answer: { result: any }) => this.log('Answer:', answer.result))
  //   .catch(this.error)
  // }
}
