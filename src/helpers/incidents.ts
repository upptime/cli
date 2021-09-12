import {dump, load} from 'js-yaml'
import {readFile, writeFile, ensureFile} from 'fs-extra'
import path, {join} from 'path'
import {Incidents, UppConfig} from '../interfaces'
import slugify from '@sindresorhus/slugify'

let __incident: Incidents | undefined

export const getIncidents = async (): Promise<Incidents> => {
  if (__incident) return __incident
  const incident = load(await readFile(join('.', 'incidents.yml'), 'utf8')) as Incidents
  __incident = incident
  return incident
}

export const incidentsForSlugExists =  async (slug: string, name: string, url: string) => {
  await ensureFile('incidents.yml')
  const incidents = await getIncidents()
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

export const createIncident = async (title: string, desc: string, willCloseAt: number|undefined, author: string, site: UppConfig['sites'][0]): Promise<void> => {
  const slug = site.slug ?? slugify(site.name)
  await incidentsForSlugExists(site.name, slug, site.url)
  const incidents = await getIncidents()
  const id = incidents[slug].useID
  const now = Date.now()
  // write to incidents.yml
  incidents[slug].incidents.unshift({
    id,
    createdAt: now,
    willCloseAt: willCloseAt,
    status: 'open',
  })
  incidents[slug].useID = id + 1
  __incident = incidents
  await writeFile('incidents.yml', dump(incidents))

  // write to incidents/slugified-site-folder/$id-$title.md
  const mdPath = path.join('incidents', slug, `${id}-${title}`)
  await ensureFile(mdPath)
  const content = `---
id: ${id}
labels: ${slug}
assignees: ${site.assignees?.join(', ')}
---
# ${title}

<!--start:commment:0 author:${author} last_modified:${now}-->
${desc}
<!--end:comment:0 -->
---
`
  await writeFile(mdPath, content)
}

export const closeMaintenanceIncidents = async (slug: string) => {
  const incidents = await getIncidents()
  const now = Date.now()
  incidents[slug].incidents.filter(incident => {
    if (incident.status === 'open' &&  incident.willCloseAt && incident.willCloseAt < now)
      return true
    return false
  })
}

export const closeIncident = async (slug: string, id: number) => {
  const incidents = await getIncidents()
  const incident = incidents[slug].incidents[id]
  incident.closedAt = Date.now()
  incident.status = 'closed'
  __incident = incidents
  await writeFile('incidents.yml', dump(incidents))
}
