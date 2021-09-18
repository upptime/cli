import Command from '@oclif/command'
import {createLoggers} from './helpers/log'
import {config} from 'dotenv'

export default abstract class extends Command {
  async init() {
    await createLoggers()
    config()
  }
}
