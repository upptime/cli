import {stat} from 'fs-extra'
import {getConfig} from './config'

export let isLogColor: undefined | boolean
export const getIsLogColor = async () => {
  if (isLogColor) return isLogColor
  try {
    await stat('.uclirc.yml')
  } catch (_) {
    return isLogColor
  }
  const config = await getConfig()
  isLogColor = config.logs?.colors
  return isLogColor
}
