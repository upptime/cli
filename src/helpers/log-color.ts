import {getConfig} from './config'

export let isLogColor: undefined | boolean
export const getIsLogColor = async () => {
  if (isLogColor) return isLogColor
  const config = await getConfig()
  isLogColor = config.logs?.colors
  return isLogColor
}
