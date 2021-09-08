import Command from '@oclif/command'
import {createLoggers} from './helpers/log'

export default abstract class extends Command {
  async init() {
    await createLoggers()
  }
}
