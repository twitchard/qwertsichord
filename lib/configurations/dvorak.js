const MelodyPipe = require('../instruments/melodypipe')
const Drones = require('../instruments/drones')

const MELODY_KEYS = [
    'h',
    't',
    'n',
    's'
]
const MELODY_SHARP_KEY = 'd'

const DRONE_KEYS = [
    'u',
    'e',
    'o',
    'a'
]
const DRONE_SHARP_KEY = 'i'

function init (output, xevEmitter) {
    const melodyPipe = new MelodyPipe(
        0, // MIDI Channel
        20, // MIDI Program
        output,
        MELODY_KEYS,
        MELODY_SHARP_KEY
    )

    const drones = new Drones(
        1, //MIDI Channel
        output,
        DRONE_KEYS,
        DRONE_SHARP_KEY
    )

    return {
        connect: () => {
            melodyPipe.connect(xevEmitter)
            drones.connect(xevEmitter)
        },
        stop: () => {
            melodyPipe.stop()
            drones.stop()
        }
    }
}
module.exports = init
