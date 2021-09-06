import { load } from 'js-yaml'
import { readFile } from 'fs-extra'
import { join } from 'path'
import { Incident } from '../interfaces'

let __incident: Incident | undefined

export const getIncidents = async (): Promise<Incident> => {
  if (__incident) return __incident
  const incident = load(await readFile(join('.', 'incidents.yml'), 'utf8')) as Incident
  __incident = incident
  return incident
}
