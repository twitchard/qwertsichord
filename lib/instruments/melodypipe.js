'use strict'

const ionianScale = require('./lib/scales').ionianScale
const MIDDLE_C = require('./lib/notes').MIDDLE_C

const BASE_NOTE = MIDDLE_C

// Velocity is "how hard you hit the note". This may have an effect
// or not, depending on the soundfont in use and the program. The
// MIDI standard specifies that MIDI inputs that do not support
// "velocity" (ours does not) then you should use velocity 64.
const VELOCITY = 64

// It is not realistic to expect a user to press all the notes of
// a combination down at exactly the same time. Thus, unintended
// notes will play for a brief period of time in between when the
// first and last notes of the combination are pressed. To address
// this, we wait <BUFFER> milliseconds after when the first note
// is pressed before sounding a note.
const BUFFER   = 30
class MelodyPipe {
    /**
     * @constructor
     *   The melody pipe is a musical instrument that sounds a single
     *   note according to which combination of keys are currently
     *   pressed. You can change the note by pressing a different
     *   combination of keys, and stop the note from playing entirely
     *   by releasing all the keys.
     * @param {Number} channel -
     *   Which MIDI channel should this pipe play on?
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
     *   Which MIDI output should this pape send events to?
     *
     * @param {Array} melodyKeys -
     *   Keys used to play melody notes. Each key will be assigned a
     *   powers-of-two value based on their index in this array.
     *
     * @param {String} sharpKey -
     *   Key used to raise the note one half-step higher.
     */
    constructor (channel, program, output, melodyKeys, sharpKey) {
        // MIDI output
        this.output = output

        //

        // Register the pipe musical instrument to play on the
        // specified channel.
        this.channel = channel
        this.output.send('program', {
            channel: channel,
            number: program
        })

        this.melodyKeys = melodyKeys
        this.sharpKey = sharpKey

        // Which keys are down right now?
        this.keyboard = new Set()

        // The currently sounding note.
        this.note = null

        // Are we in the buffer period after a key has been
        // pressed?
        this.refreshing = false
    }

    /**
     * Stop all notes from sounding.
     */
    stop () {
        this.play(null)
    }

    /**
     * Refresh the currently sounding note.
     *
     * Called when the combination of currently pressed
     * keys has changed.
     */
    _refresh () {
        if (this.refreshing) {
            return
        }

        this.refreshing = true

        setTimeout(() => {
            this.refreshing = false
            let num = 0
            let mult = 1

            this.melodyKeys.map((x) => {
                if (this.keyboard.has(x)) {
                    num += mult
                }
                mult *= 2
            })
            const sharp = this.keyboard.has(this.sharpKey) ? 1 : 0
            if (num === 0) {
                this.play(null)
            } else {
                this.play(BASE_NOTE + ionianScale(num - 1) + sharp)
            }
        }, BUFFER)
    }

    /**
     * Switch to playing the specified note. If note is 'null',
     * then start playing nothing.
     */
    play (note) {
        if (this.note) {
            this.output.send('noteoff', this.note)
        }

        if (note) {
            const send = {
                note,
                velocity: VELOCITY,
                channel: this.channel
            }
            this.output.send('noteon', send)
            this.note = send
        }
    }

    /**
     * Register this instrument with a source of xev keyboard events
     * @param {Object} xevEmitter
     */
    connect (xevEmitter) {
        xevEmitter.on('KeyPress', (key) => {
            this.keyboard.add(key)
            this._refresh()
        })
        xevEmitter.on('KeyRelease', (key) => {
            this.keyboard.delete(key)
            this._refresh()
        })
        this._refresh()
    }
}
module.exports = MelodyPipe
