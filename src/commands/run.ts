import {Command, flags} from '@oclif/command'
import {schedule} from 'node-cron'
import PQueue from 'p-queue'
import {generateGraphs} from '../graphs'
import {getConfig} from '../helpers/config'
import {GRAPHS_CI_SCHEDULE, STATIC_SITE_CI_SCHEDULE, SUMMARY_CI_SCHEDULE, UPTIME_CI_SCHEDULE} from '../helpers/constants'
import {UppConfig} from '../interfaces'
import {generateSite} from '../site'
import {generateSummary} from '../summary'
import {update} from '../update'

export default class Run extends Command {
static description = 'Run workflows'

static flags = {
  help: flags.help({char: 'h'}),
  iterations: flags.integer({char: 'i', description: 'number of iterations'}),

  uptime: flags.boolean({char: 'u'}),
  summary: flags.boolean({char: 's'}),
  staticSite: flags.boolean({char: 'p'}),
  graphs: flags.boolean({char: 'g'}),
}

static args = [{name: 'iterations'}]

async run() {
  const {flags} = this.parse(Run)
  const queue = new PQueue({concurrency: 1})
  const config: UppConfig = await getConfig()

  const returnWorkflows = (func: (() => Promise<void>), cronSchedule: string) => {
    schedule(cronSchedule, async () => queue.add(func))
  }

  // It would be desirable to execute each iteration of CI in a cycle
  if (flags.iterations) {
    for (let i = 0; i < flags.iterations; i++) {
      if (flags.uptime)
        queue.add(update)
      if (flags.staticSite)
        queue.add(generateSite)
      if (flags.graphs)
        queue.add(generateSite)
      if (flags.summary)
        queue.add(generateSummary)
    }
  } else {
    if (flags.uptime)
      returnWorkflows(update, config.workflowSchedule?.uptime ?? UPTIME_CI_SCHEDULE)
    if (flags.staticSite)
      returnWorkflows(generateSite, config.workflowSchedule?.staticSite ?? STATIC_SITE_CI_SCHEDULE)
    if (flags.graphs)
      returnWorkflows(generateGraphs, config.workflowSchedule?.graphs ?? GRAPHS_CI_SCHEDULE)
    if (flags.summary)
      returnWorkflows(generateSummary, config.workflowSchedule?.summary ?? SUMMARY_CI_SCHEDULE)
  }
  /* Experimenting env variables
  const secret = '{'GH_PAT':'Yo'}'
  const pwd: string = Buffer.from(execSync('pwd'), 'hex').toString('utf8')
  execSync('export SECRETS_CONTEXT="haha"')
  this.log(Buffer.from(execSync('echo $SECRETS_CONTEXT'), 'hex').toString('utf8'))
  execSync(`npx -c run ${config.packages.response}`, {stdio: 'inherit'}) */
}
}
