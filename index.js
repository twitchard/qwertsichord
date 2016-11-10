const output       = require('./output')
const xevEmitter   = require('xev-emitter')(process.stdin)

const MelodyPipe = require('./instruments/melodypipe')
const melodyPipe = new MelodyPipe(output)

const Drones = require('./instruments/drones')
const drones = new Drones(output)

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
