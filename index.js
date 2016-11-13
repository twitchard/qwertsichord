const output       = require('./output')
const xevEmitter   = require('xev-emitter')(process.stdin)

const MelodyPipe = require('./instruments/melodypipe')
const Drones = require('./instruments/drones')

const melodyPipe = new MelodyPipe(0, output)
const drones = new Drones(1, output)

melodyPipe.connect(xevEmitter)
drones.connect(xevEmitter)

function cleanUp () {
    console.log('stopping...')
    melodyPipe.stop()
    melodyPipe.stop()
    process.exit(0)
}

process.on('SIGTERM', cleanUp)
process.on('SIGINT', cleanUp)
