upp
===

Uptime monitor and status page powered by GitHub Actions, Issues, and Pages

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/upp.svg)](https://npmjs.org/package/upp)
[![CircleCI](https://circleci.com/gh/upptime/cli/tree/master.svg?style=shield)](https://circleci.com/gh/upptime/cli/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/upp.svg)](https://npmjs.org/package/upp)
[![License](https://img.shields.io/npm/l/upp.svg)](https://github.com/upptime/cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g upp
$ upp COMMAND
running command...
$ upp (-v|--version|version)
upp/0.0.0 win32-x64 node-v14.3.0
$ upp --help [COMMAND]
USAGE
  $ upp COMMAND
...
```
<!-- usagestop -->
```sh-session
$ npm install -g upp
$ upp COMMAND
running command...
$ upp (-v|--version|version)
upp/0.0.0 darwin-x64 node-v12.18.3
$ upp --help [COMMAND]
USAGE
  $ upp COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`upp docs`](#upp-docs)
* [`upp help [COMMAND]`](#upp-help-command)
* [`upp incidents [FILE]`](#upp-incidents-file)
* [`upp init`](#upp-init)
* [`upp run [ITERATIONS]`](#upp-run-iterations)
* [`upp status`](#upp-status)

## `upp docs`

redirects to Upptime docs

```
USAGE
  $ upp docs
```

_See code: [src/commands/docs.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/docs.ts)_

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

## `upp incidents [FILE]`

describe the command here

```
USAGE
  $ upp incidents [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/incidents.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/incidents.ts)_

## `upp init`

initializes upptime

```
USAGE
  $ upp init
```

_See code: [src/commands/init.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/init.ts)_

## `upp run [ITERATIONS]`

Run workflows

```
USAGE
  $ upp run [ITERATIONS]

OPTIONS
  -g, --graphs
  -h, --help                   show CLI help
  -i, --iterations=iterations  number of iterations
  -p, --staticSite
  -s, --summary
  -u, --uptime
```

_See code: [src/commands/run.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/run.ts)_

## `upp status`

updates about status of websites

```
USAGE
  $ upp status
```

_See code: [src/commands/status.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/status.ts)_
<!-- commandsstop -->
* [`upp docs`](#upp-docs)
* [`upp help [COMMAND]`](#upp-help-command)
* [`upp run [ITERATIONS]`](#upp-run-iterations)
* [`upp init [FILE]`](#upp-init-file)
* [`upp status`](#upp-status)

## `upp docs`

redirects to Upptime docs

```
USAGE
  $ upp docs
```

_See code: [src/commands/docs.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/docs.ts)_

## `upp heee [FILE]`

describe the command here

```
USAGE
  $ upp heee [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/heee.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/heee.ts)_

## `upp hello [FILE]`

describe the command here

```
USAGE
  $ upp hello [FILE]
```

_See code: [src/commands/hello.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/hello.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `upp run [ITERATIONS]`
## `upp init [FILE]`

Run workflows

```
USAGE
  $ upp run [ITERATIONS]
  $ upp init [FILE]

OPTIONS
  -S, --setup
  -g, --graphs
  -h, --help                   show CLI help
  -i, --iterations=iterations  number of iterations
  -p, --pages
  -s, --summary
  -u, --uptime
```

_See code: [src/commands/run.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/run.ts)_

## `upp status`

updates about status of websites

```
USAGE
  $ upp status
```

_See code: [src/commands/init.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/init.ts)_

## `upp status`

updates about status of websites

```
USAGE
  $ upp status
```

_See code: [src/commands/init.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/init.ts)_

## `upp status`

updates about status of websites

```
USAGE
  $ upp status
```

_See code: [src/commands/status.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/status.ts)_
<!-- commandsstop -->
