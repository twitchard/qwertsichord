'use strict'

const ionianScale = require('./lib/scales').ionianScale
const MIDDLE_C    = require('./lib/notes').MIDDLE_C

const BASE_NOTE = MIDDLE_C - 12

// Dvorak
const DRONE_KEYS = [
    'u',
    'e',
    'o',
    'a'
]
const SHARP_KEY = 'i'

// Qwerty
// const DRONE_KEYS = [
//     'a',
//     's',
//     'd',
//     'f'
// ]
// const SHARP_KEY = 'g'

// A MIDI soundfont implements a number of "programs" or "patches"
// these are basically different instrument samples. For example,
// program "1" might be a grand piano. Program 60 might be some sort
// of drum kit.

// There is a "general MIDI" standard, which a soundfont can implement,
// and it defines which program numbers should sound like which instruments.
// In this case, program 18 sounds like an organ.
const PROGRAM  = 18

// Velocity is "how hard you hit the note". This may have an effect
// or not, depending on the soundfont in use and the program. The
// MIDI standard specifies that MIDI inputs that do not support
// "velocity" (ours does not) then you should use velocity 64.
const VELOCITY = 64

/**
 * Your "stroke" is the set of any drone/sharp keys that were pressed 
 * down at any point between when you pressed down the first drone/sharp
 * key, and when you released all drone/sharp keys.
 * 
 * Your strokeNote is the musical note this set corresponds to.
 * Start at the B one octave and one note below middle C. Then, if the
 * index finger is pressed, go up the C major scale one note. If
 * the middle finger is pressed, go up the C major scale two notes.
 * If the ring finger is pressed, go up the C major scale four notes.
 * If the pinky is pressed, go up the C major scale eight notes.
 * Finally, if the sharp key is pressed, go up a half step.
 */
function strokeNote (stroke) {
    let num = 0
    let mult = 1

    DRONE_KEYS.map((x) => {
        if (stroke.has(x)) {
            num += mult
        }
        mult *= 2
    })

    const sharp = stroke.has(SHARP_KEY) ? 1 : 0
    return BASE_NOTE + ionianScale(num - 1) + sharp
}

/**
 * @constructor
 *   Drones are a musical instrument where you toggle a note
 *   by pressing and releasing a combination of keys, and that
 *   note sounds indefinitely until you toggle it off by pressing 
 *   and releasing that same combination of keys.
 * @param {number} channel - 
 *   Which MIDI channel should these drones play on?
 * @param {object} output -
 *   Which MIDI output should these drones send events to?
 */
class Drones {
    constructor (channel, output) {
        // MIDI output
        this.output = output

        // Register the drone musical instrument to play on this
        // channel.
        this.channel = channel
        this.output.send('program', {
            channel: channel,
            number: PROGRAM
        })

        // Which keys are down right now?
        this.activeKeys = new Set()

        // Which drone/sharp keys have been pressed between now
        // and the last time no drone/sharp keys were down?
        this.stroke     = new Set()

        // Which drones (musical notes) are currently sounding?
        this.drones = {}
    }

    /**
     * Stop all notes from playing
     */
    stop () {
        Object.keys(this.drones).map((drone) => {
            this.output.send('noteoff', this.drones[drone])
            delete this.drones[drone]
        })
    }


    /**
     * Cause a note to begin sounding if it is not already sounding,
     * or to stop sounding if it is already sounding
     *
     * @param {Number} note
     */
    toggleDrone (note) {
        if (this.drones[note]) {
            this.output.send('noteoff', this.drones[note])
            delete this.drones[note]
            return
        }
        const send = {
            note: note,
            velocity: VELOCITY,
            channel: this.channel
        }
        this.drones[note] = send
        this.output.send('noteon', send)
    }

    /**
     * Register this instrument with a source of xev keyboard events
     * @param {Object} xevEmitter
     */
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
                this.toggleDrone(strokeNote(this.stroke))
                this.stroke.clear()
            }
        })
    }
}
module.exports = Drones
