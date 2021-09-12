import {exec} from 'shelljs'
import {infoErrorLogger} from './log'

const _getNameAndEmail = () => {
  const currName = exec('git config --list', {silent: true}).grep('user.name=').stdout.split(
    'user.name='
  ).pop()?.trim()
  const currEmail = exec('git config --list', {silent: true}).grep('user.email=').stdout.split(
    'user.email='
  ).pop()?.trim()
  return {currName, currEmail}
}

const _setNameAndEmail = (
  name = 'Upptime Bot',
  email = '73812536+upptime-bot@users.noreply.github.com'
) => {
  exec(`git config user.email "${email}"`)
  exec(`git config user.name "${name}"`)
}

export const commit = (
  message: string,
  name: string | undefined,
  email: string | undefined,
  files?: string,
) => {
  const {currName: prevName, currEmail: prevEmail} = _getNameAndEmail()
  _setNameAndEmail(name, email)
  exec(`git add ${files ?? '.'}`)
  infoErrorLogger.info(
    exec(`git commit -m "${message.replace(/"/g, "''")}"`, {silent: true})
    .stdout
  )
  _setNameAndEmail(prevName, prevEmail)
}

export const push = () => {
  const {currName: prevName, currEmail: prevEmail} = _getNameAndEmail()
  _setNameAndEmail()
  const result = exec('git push')
  if (result.includes('error:')) throw new Error(result)
  _setNameAndEmail(prevName, prevEmail)
}

export const lastCommit = () => {
  return exec('git log --format="%H" -n 1').stdout
}
