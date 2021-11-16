import Help from '@oclif/plugin-help'
import chalk from 'chalk'
import figlet from 'figlet'

export default class MyHelpClass extends Help {
  // the formatting responsible for the header
  // displayed for the root help
  formatRoot(): string {
    return `\n${chalk.green(figlet.textSync('Upptime', {font: 'ANSI Shadow', verticalLayout: 'controlled smushing'}))}\n${super.formatRoot()}`
  }
}
