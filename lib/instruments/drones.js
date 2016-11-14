'use strict'

const ionianScale = require('./lib/scales').ionianScale
const MIDDLE_C    = require('./lib/notes').MIDDLE_C

const BASE_NOTE = MIDDLE_C - 12

// Velocity is "how hard you hit the note". This may have an effect
// or not, depending on the soundfont in use and the program. The
// MIDI standard specifies that MIDI inputs that do not support
// "velocity" (ours does not) then you should use velocity 64.
const VELOCITY = 64


class Drones {
    /**
     * @constructor
     *   Drones are a musical instrument where you toggle a note
     *   by pressing and releasing a combination of keys, and that
     *   note sounds indefinitely until you toggle it off by pressing
     *   and releasing that same combination of keys.
     * @param {number} channel -
     *   Which MIDI channel should these drones play on?
     * @param {Number} program -
     *   A MIDI soundfont implements a number of "programs" or "patches"
     *   these are basically different instrument samples. For example,
     *   program "1" might be a grand piano. Program 60 might be some sort
     *   of drum kit.
     *
     *   There is a "general MIDI" standard, which a soundfont can implement,
     *   and it defines which program numbers should sound like which instruments.
     *   In this case, program 20 sounds like an organ.
     * @param {object} output -
     *   Which MIDI output should these drones send events to?
     *
     * @param {Array} droneKeys -
     *   Keys used to select a drone to toggle. Each key will be
     *   assigned a powers-of-two value based on their index in
     *   this array.
     *
     * @param {String} sharpKey -
     *   Key used to select a drone one half-step higher.
     */
    constructor (channel, program, output, droneKeys, sharpKey) {
        // MIDI output
        this.output = output

        // Register the drone musical instrument to play on this
        // channel.
        this.channel = channel
        this.output.send('program', {
            channel: channel,
            number: program
        })

        this.droneKeys = droneKeys
        this.sharpkey = sharpKey

        // Which keys are down right now?
        this.activeKeys = new Set()

        // Which drone/sharp keys have been pressed between now
        // and the last time no drone/sharp keys were down?
        this.stroke     = new Set()

        // Which drones (musical notes) are currently sounding?
        this.drones = {}
    }
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
    strokeNote (stroke) {
        let num = 0
        let mult = 1

        this.droneKeys.map((x) => {
            if (stroke.has(x)) {
                num += mult
            }
            mult *= 2
        })

        const sharp = stroke.has(this.sharpKey) ? 1 : 0
        return BASE_NOTE + ionianScale(num - 1) + sharp
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
            if (this.droneKeys.indexOf(key) !== -1 || key === this.sharpKey) {
                this.activeKeys.add(key)
                this.stroke.add(key)
            }
        })
        xevEmitter.on('KeyRelease', (key) => {
            if (this.droneKeys.indexOf(key) !== -1 || key === this.sharpKey) {
                this.activeKeys.delete(key)
            }
            if (this.activeKeys.size === 0 && this.stroke.size > 0) {
                this.toggleDrone(this.strokeNote(this.stroke))
                this.stroke.clear()
            }
        })
    }
}
module.exports = Drones
