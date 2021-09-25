/* eslint-disable complexity */
import {flags} from '@oclif/command'
import Command from '../base'
import {schedule} from 'node-cron'
import PQueue from 'p-queue'
import {generateGraphs} from '../helpers/graphs'
import {getConfig} from '../helpers/config'
import {GRAPHS_CI_SCHEDULE, RESPONSE_TIME_CI_SCHEDULE, STATIC_SITE_CI_SCHEDULE, SUMMARY_CI_SCHEDULE, UPTIME_CI_SCHEDULE} from '../helpers/constants'
import {UppConfig} from '../interfaces'
import {generateSite} from '../site'
import {generateSummary} from '../summary'
import {update} from '../update'
import {cli} from 'cli-ux'
import { Dayvalues , Weekvalues, Monthvalues, Yearvalues} from '../graphs'

export default class Run extends Command {
static description = 'Run workflows'

static flags = {
  help: flags.help({char: 'h', description: 'Show help for run cmd'}),
  iterations: flags.integer({char: 'i', description: 'Number of iterations'}),
  quiet: flags.boolean({char: 'q', description: 'Quiet'}),
  uptime: flags.boolean({char: 'u', description: 'Check change in status'}),
  summary: flags.boolean({char: 's', description: 'Generate README.md'}),
  staticSite: flags.boolean({char: 'p', description: 'Generate and build static site'}),
  graphs: flags.boolean({char: 'g', description: 'Generate graphs'}),
  responseTime: flags.boolean({char: 'r', description: 'Commit response time'}),
}

static args = [{name: 'iterations'}]

async run() {
  // console.log("test run")
  const {flags} = this.parse(Run)
  const queue = new PQueue({concurrency: 1})
  const config: UppConfig = await getConfig()

  const returnWorkflows = (func: (() => Promise<void>), cronSchedule: string) => {
    schedule(cronSchedule, async () => queue.add(func))
  }

  const noWorkflowFlags = !flags.responseTime && !flags.uptime && !flags.summary && !flags.staticSite && !flags.graphs

  // It would be desirable to execute each iteration of CI in a cycle
  if (flags.iterations) {
    for (let i = 0; i < flags.iterations; i++) {
      console.log("running for "+i+1+"th iteration")
      if (flags.uptime)
        queue.add(update)
      if (flags.responseTime)
        queue.add(() => update(true))
      if (flags.graphs)
        // method to call data point function
        // queue.add(() => Dayvalues('Github'))
        // queue.add(() => Weekvalues('Google'))
        // queue.add(() => Monthvalues('Wikipedia'))
        // queue.add(() => Yearvalues('Yahoo'))
        queue.add(generateGraphs)
      if (flags.summary)
        queue.add(generateSummary)
      if (flags.staticSite)
        queue.add(generateSite)
      /* If no workflow related flag is passed, run all workflows
        update(false) is omitted because we already are checking status while update(true)
      */
      if (noWorkflowFlags) {
        queue.add(() => update(true))
        queue.add(generateGraphs)
        queue.add(generateSummary)
        queue.add(generateSite)
      }
    }
  } 
  else {
    console.log("Setting up workflows")
    // cli.action.stop('Workflows set-up complete')
    if (flags.uptime)
      returnWorkflows(update, config.workflowSchedule?.uptime ?? UPTIME_CI_SCHEDULE)
    if (flags.responseTime)
      returnWorkflows(() => update(true), config.workflowSchedule?.responseTime ?? RESPONSE_TIME_CI_SCHEDULE)
    if (flags.graphs)
      returnWorkflows(generateGraphs, config.workflowSchedule?.graphs ?? GRAPHS_CI_SCHEDULE)
    if (flags.summary)
      returnWorkflows(generateSummary, config.workflowSchedule?.summary ?? SUMMARY_CI_SCHEDULE)
    if (flags.staticSite)
      returnWorkflows(generateSite, config.workflowSchedule?.staticSite ?? STATIC_SITE_CI_SCHEDULE)
    // If no workflow related flags passed, run all workflows as per defined schedule
    if (noWorkflowFlags) {
      returnWorkflows(update, config.workflowSchedule?.uptime ?? UPTIME_CI_SCHEDULE)
      returnWorkflows(() => update(true), config.workflowSchedule?.responseTime ?? RESPONSE_TIME_CI_SCHEDULE)
      returnWorkflows(generateGraphs, config.workflowSchedule?.graphs ?? GRAPHS_CI_SCHEDULE)
      returnWorkflows(generateSummary, config.workflowSchedule?.summary ?? SUMMARY_CI_SCHEDULE)
      returnWorkflows(generateSite, config.workflowSchedule?.staticSite ?? STATIC_SITE_CI_SCHEDULE)
    }
  }
  /* Experimenting env variables
  const secret = '{'GH_PAT':'Yo'}'
  const pwd: string = Buffer.from(execSync('pwd'), 'hex').toString('utf8')
  execSync('export SECRETS_CONTEXT="haha"')
  this.log(Buffer.from(execSync('echo $SECRETS_CONTEXT'), 'hex').toString('utf8'))
  execSync(`npx -c run ${config.packages.response}`, {stdio: 'inherit'}) */
}
}
