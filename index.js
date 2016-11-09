const output     = require('./output')
const xevEmitter = require('xev-emitter')(process.stdin)
const EventEmitter = require('events')
const keyboard   = new EventEmitter()

// DVORAK
const pianoKeys = {
    'a':  0,
    'o':  2,
    'e':  4,
    'u':  5,

    'h':  7,
    't':  9,
    'n': 11,
    's': 12
}

// QWERTY
// const pianoKeys = {
//     'a':  0,
//     's':  2,
//     'd':  4,
//     'f':  5,
// 
//     'j':  7,
//     'k':  9,
//     'l': 11,
//     ';': 12
// }


function play (n) {
    output.send('noteon', {
        note: 60 + n,
        velocity: 127,
        channel: 3
    })
}

function mute (n) {
    output.send('noteoff', {
        note: 60 + n,
        velocity: 127,
        channel: 3
    })
}


xevEmitter.on('KeyPress', function (key) {
    if (undefined !== pianoKeys[key]) {
        play(pianoKeys[key])
    }
})

xevEmitter.on('KeyRelease', function (key) {
    if (undefined !== pianoKeys[key]) {
        mute(pianoKeys[key])
    }
})
