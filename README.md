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
# Usage
<!-- usage -->
```sh-session
$ npm install -g upp
$ upp COMMAND
running command...
$ upp (-v|--version|version)
upp/0.0.0 linux-x64 node-v12.22.1
$ upp --help [COMMAND]
USAGE
  $ upp COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`upp docs`](#upp-docs)
* [`upp hello [FILE]`](#upp-hello-file)
* [`upp help [COMMAND]`](#upp-help-command)
* [`upp run`](#upp-run)
* [`upp status`](#upp-status)
* [`upp test [FILE]`](#upp-test-file)

## `upp docs`

redirects to Upptime docs

```
USAGE
  $ upp docs
```

_See code: [src/commands/docs.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/docs.ts)_

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

## `upp run`

Run workflows

```
USAGE
  $ upp run

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/run.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/run.ts)_

## `upp status`

updates about status of websites

```
USAGE
  $ upp status
```

_See code: [src/commands/status.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/status.ts)_

## `upp test [FILE]`

describe the command here

```
USAGE
  $ upp test [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/test.ts](https://github.com/upptime/cli/blob/v0.0.0/src/commands/test.ts)_
<!-- commandsstop -->
