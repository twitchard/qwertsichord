#!/usr/bin/env node
'use strict'
const output       = require('../lib/output')
const xevEmitter   = require('xev-emitter')(process.stdin)

const CONFIGURATION_NAME = process.argv[2] || 'qwerty'

const configuration = require('../lib/configurations/' + CONFIGURATION_NAME)(output, xevEmitter)


process.on('SIGTERM', configuration.stop)
process.on('SIGTERM', process.exit.bind(process, 0))
process.on('SIGINT', configuration.stop)
process.on('SIGINT', process.exit.bind(process, 0))
