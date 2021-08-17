import {load} from 'js-yaml'
import {readFile} from 'fs-extra'
import {join} from 'path'
import {UppConfig} from '../interfaces'

let __config: UppConfig | undefined

export const getConfig = async (): Promise<UppConfig> => {
  if (__config) return __config
  const config = load(await readFile(join('.', '.uclirc.yml'), 'utf8')) as UppConfig
  __config = config
  return config
}
