'use strict'
const MIDDLE_C = 60

const MELODY_KEYS = [
    'h',
    't',
    'n',
    's'
]

const SHARP_KEY = 'd'

const IONIAN = [0, 2, 4, 5, 7, 9, 11]
function ionian (n) {
    return ~~(n/7)*12 + IONIAN[n%7]
}

const CHANNEL  = 3
const PROGRAM  = 20
const VELOCITY = 64
const BUFFER   = 10

class MelodyPipe {
    constructor (output) {
        this.keyboard = {}
        this.output = output

        this.output.send('program', {
            channel: CHANNEL,
            number: PROGRAM
        })

        this.note = null
    }

    stop () {
        if (this.note) {
            this.output.send('noteoff', this.note)
        }
    }

    refresh () {
        if (this.refreshing) {
            return
        }

        this.refreshing = true

        setTimeout(() => {
            this.refreshing = false
            let num = 0
            let mult = 1

            MELODY_KEYS.map((x) => { 
                if (this.keyboard[x]) {
                    num += mult
                }
                mult *= 2
            })
            const sharp = this.keyboard[SHARP_KEY] ? 1 : 0
            if (num === 0) {
                this.play(null)
            } else {
                this.play(MIDDLE_C + ionian(num - 1) + sharp)
            }
        }, BUFFER)
    }

    play (note) {
        if (this.note) {
            this.output.send('noteoff', this.note)
        }

        if (note) {
            const send = {
                note,
                velocity: VELOCITY,
                channel: CHANNEL
            }
            this.output.send('noteon', send)
            this.note = send
        }
    }

    connect (xevEmitter) {
        xevEmitter.on('KeyPress', (key) => {
            this.keyboard[key] = true
            this.refresh()
        })
        xevEmitter.on('KeyRelease', (key) => {
            this.keyboard[key] = false
            this.refresh()
        })
        this.refresh()
    }
}
module.exports = MelodyPipe
