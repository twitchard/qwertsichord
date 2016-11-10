'use strict'

const MIDDLE_C = 60

const DRONE_KEYS = [
    'u',
    'e',
    'o',
    'a'
]

const SHARP_KEY = 'i'

const IONIAN = [0, 2, 4, 5, 7, 9, 11]
function ionian (n) {
    return ~~(n/7)*12 + IONIAN[n%7]
}

const CHANNEL  = 4
const PROGRAM  = 18
const VELOCITY = 64
const BUFFER   = 10

function strokeNum (stroke) {
    let num = 0
    let mult = 1

    DRONE_KEYS.map((x) => {
        if (stroke.has(x)) {
            num += mult
        }
        mult *= 2
    })

    const sharp = stroke.has(SHARP_KEY) ? 1 : 0
    return MIDDLE_C - 12 + ionian(num - 1) + sharp
}

class Drones {
    constructor (output) {
        this.activeKeys = new Set()
        this.stroke     = new Set()

        this.drones = {}
        this.output = output

        this.output.send('program', {
            channel: CHANNEL,
            number: PROGRAM
        })

        this.note = null
    }

    stop () {
        Object.keys(this.drones).map((drone) => {
            this.output.send('noteoff', this.drones[drone])
            delete this.drones[drone]
        })
    }


    toggleDrone (drone) {
        if (this.drones[drone]) {
            this.output.send('noteoff', this.drones[drone])
            delete this.drones[drone]
            return
        }
        const send = {
            note: drone,
            velocity: 64,
            channel: CHANNEL
        }
        this.drones[drone] = send
        this.output.send('noteon', send)
    }

    connect (xevEmitter) {
        xevEmitter.on('KeyPress', (key) => {
            if (DRONE_KEYS.indexOf(key) !== -1 || key === SHARP_KEY) {
                this.activeKeys.add(key)
                this.stroke.add(key)
            }
        })
        xevEmitter.on('KeyRelease', (key) => {
            if (DRONE_KEYS.indexOf(key) !== -1 || key === SHARP_KEY) {
                this.activeKeys.delete(key)
            }
            if (this.activeKeys.size === 0 && this.stroke.size > 0) {
                this.toggleDrone(strokeNum(this.stroke))
                this.stroke.clear()
            }
        })
    }
}
module.exports = Drones
