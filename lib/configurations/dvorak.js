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
        18, //MIDI Program
        output,
        DRONE_KEYS,
        DRONE_SHARP_KEY
    )

    melodyPipe.connect(xevEmitter)
    drones.connect(xevEmitter)

    return {
        stop: () => {
            melodyPipe.stop()
            drones.stop()
        }
    }
}
module.exports = init
