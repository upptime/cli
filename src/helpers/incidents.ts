import {dump, load} from 'js-yaml'
import {readFile, writeFile, ensureFile, appendFile} from 'fs-extra'
import path, {join} from 'path'
import {Incident, Incidents, UppConfig} from '../interfaces'
import slugify from '@sindresorhus/slugify'
import { debug } from 'winston'

let __incident: Incidents | undefined

const initIncidents = async (): Promise<void> => {
  await ensureFile('incidents.yml')
}

export const getIncidents = async (): Promise<Incidents> => {
  await initIncidents()
  if (__incident) return __incident
  const incident = load(await readFile(join('.', 'incidents.yml'), 'utf8')) as Incidents
  __incident = incident
  return incident
}

export const incidentsForSlugExists =  async (slug: string, name: string, url: string) => {
  await initIncidents()
  let incidents = await getIncidents()
  if (!incidents)
    incidents = {} as Incidents
  if (!incidents[slug]) {
    incidents[slug] = {
      name,
      url,
      useID: 1,
      incidents: [],
    }
  }
  await writeFile('incidents.yml', dump(incidents))
  __incident = incidents
}

export const createIncident = async (site: UppConfig['sites'][0], meta: {willCloseAt?: number; author: string; assignees: string[]; labels: string[]}, title: string, desc: string): Promise<void> => {
  const slug = site.slug ?? slugify(site.name)
  await incidentsForSlugExists(site.name, slug, site.url)
  const incidents = await getIncidents()
  debug(incidents[slug].incidents.toString())
  debug(incidents[slug].name)
  const id = incidents[slug].useID
  const now = Date.now()
  // write to incidents.yml
  incidents[slug].incidents.unshift({
    id,
    createdAt: now,
    willCloseAt: meta.willCloseAt,
    status: 'open',
    title,
    labels: meta.labels,
  })
  incidents[slug].useID = id + 1
  __incident = incidents
  await writeFile('incidents.yml', dump(incidents))

  // write to incidents/slugified-site-folder/$id-$title.md
  const mdPath = path.join('incidents', slug, `${id}-${title}`)
  await ensureFile(mdPath)
  const content = `---
id: ${id}
assignees: ${meta.assignees?.join(', ')}
---
# ${title}

<!--start:commment author:${meta.author} last_modified:${now}-->
${desc}
<!--end:comment -->
---
`
  await writeFile(mdPath, content)
}

export const closeMaintenanceIncidents = async () => {
  // Slug is not needed as a parameter, since newly added site will not have any issue
  // if it does, it must already be in incidents.yml
  const incidents = await getIncidents()
  const now = Date.now()
  const ongoingMaintenanceEvents: {incident: Incident; slug: string}[] = []
  if (incidents)
    Object.keys(incidents).forEach(slug => {
      incidents[slug].incidents.map(incident => {
        if (incident.labels?.includes('maintenance') &&  incident.willCloseAt && incident.willCloseAt < now) {
          ongoingMaintenanceEvents.push({
            incident,
            slug,
          })
          incident.status = 'closed'
        }
        return incident
      })
    })
  await writeFile('.incidents.yml', dump(incidents))
  __incident = incidents
  return ongoingMaintenanceEvents
}

export const closeIncident = async (slug: string, id: number) => {
  const incidents = await getIncidents()
  const index = incidents[slug].incidents.findIndex(i => i.id === id)
  incidents[slug].incidents[index].closedAt = Date.now()
  incidents[slug].incidents[index].status = 'closed'
  __incident = incidents
  await writeFile('incidents.yml', dump(incidents))
}

export const createComment = async (meta: {slug: string; id: number; title: string; author: string}, comment: string) => {
  const filePath = path.join('incidents', meta.slug, `${meta.id}-${meta.title}`)
  await appendFile(filePath, `
<!--start:commment author:${meta.author} last_modified:${Date.now()}-->
${comment}
<!--end:comment --> 

---
`)
}
