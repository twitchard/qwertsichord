/**
 * @param {Array} notes -
 *   A sequence of notes.
 * @param {Number} period -
 *   Extend the sequence infinitely in both directions
 *   by repeatedly transposing this number of half-steps up 
 *   and appending, and transposing this number of half-steps
 *   down and prepending.
 * @param {Number} n -
 *   Get the nth element of the infinitely extended sequence.
 */
function scale (notes, period, n) {
    return ~~(n/notes.length)*period + notes[n%notes.length]
}

exports.ionianScale = scale.bind(null, [
    // Notes (major scale):
    0,
    2,
    4,
    5,
    7,
    9,
    11
], 
    // Period (one octave):
    12
)
