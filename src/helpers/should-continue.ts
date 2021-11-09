import chalk from 'chalk'
import {existsSync} from 'fs-extra'

export class ShouldContinue {
  message: string | undefined

  continue: boolean

  constructor(shouldContinue: boolean, message?: string) {
    this.continue = shouldContinue
    this.message = message
  }
}

export async function shouldContinue() {
  if (!existsSync('.uclirc.yml')) {
    return new ShouldContinue(false, chalk.red('❌ Repository is not Upptime Initialized') + '\n' + chalk.blue('Try ') + chalk.yellow('upp run'))
  }
  return new ShouldContinue(true)
}
