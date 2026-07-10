Upptime CLI
===

Uptime monitor and status page powered by GitHub Actions, Issues, and Pages

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@upptime/upp.svg)](https://npmjs.org/package/@upptime/upp)
[![CircleCI](https://circleci.com/gh/upptime/cli/tree/main.svg?style=shield)](https://circleci.com/gh/upptime/cli/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/@upptime/upp.svg)](https://npmjs.org/package/@upptime/upp)
[![License](https://img.shields.io/npm/l/@upptime/upp.svg)](https://github.com/upptime/cli/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @upptime/upp
$ upp COMMAND
running command...
$ upp (-v|--version|version)
@upptime/upp/0.1.0-beta linux-x64 node-v14.21.3
$ upp --help [COMMAND]
USAGE
  $ upp COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`upp config`](#upp-config)
* [`upp docs`](#upp-docs)
* [`upp help [COMMAND]`](#upp-help-command)
* [`upp incidents`](#upp-incidents)
* [`upp init`](#upp-init)
* [`upp run [ITERATIONS]`](#upp-run-iterations)
* [`upp status`](#upp-status)

## `upp config`

configures uclirc.yml

```
USAGE
  $ upp config

OPTIONS
  -e, --add-env-variable           Add/edit environment variable
  -h, --help                       Show help for config cmd
  -n, --add-notification-provider  Add/edit environment variables particular to a notification provider
  -o, --open-editor                Open in editor
```

_See code: [src/commands/config.ts](https://github.com/upptime/cli/blob/v0.1.0-beta/src/commands/config.ts)_

## `upp docs`

redirects to Upptime docs

```
USAGE
  $ upp docs
```

_See code: [src/commands/docs.ts](https://github.com/upptime/cli/blob/v0.1.0-beta/src/commands/docs.ts)_

## `upp help [COMMAND]`

display help for upp

```
USAGE
  $ upp help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_

## `upp incidents`

reports all the incidents/downtimes

```
USAGE
  $ upp incidents

OPTIONS
  -e, --edit=edit    Edit an Issue
  -h, --help         Show help for run cmd
  -x, --extended     show extra columns
  --columns=columns  only show provided columns (comma-separated)
  --csv              output is csv format
  --filter=filter    filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --sort=sort        property to sort by (prepend '-' for descending)
```

_See code: [src/commands/incidents.ts](https://github.com/upptime/cli/blob/v0.1.0-beta/src/commands/incidents.ts)_

## `upp init`

initializes upptime

```
USAGE
  $ upp init
```

_See code: [src/commands/init.ts](https://github.com/upptime/cli/blob/v0.1.0-beta/src/commands/init.ts)_

## `upp run [ITERATIONS]`

Run workflows

```
USAGE
  $ upp run [ITERATIONS]

OPTIONS
  -g, --graphs                 Generate graphs
  -h, --help                   Show help for run cmd
  -i, --iterations=iterations  Number of iterations
  -p, --staticSite             Generate and build static site
  -q, --quiet                  Quiet
  -r, --responseTime           Commit response time
  -s, --summary                Generate README.md
  -u, --uptime                 Check change in status
```

_See code: [src/commands/run.ts](https://github.com/upptime/cli/blob/v0.1.0-beta/src/commands/run.ts)_

## `upp status`

updates about status of websites

```
USAGE
  $ upp status
```

_See code: [src/commands/status.ts](https://github.com/upptime/cli/blob/v0.1.0-beta/src/commands/status.ts)_
<!-- commandsstop -->
