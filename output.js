const easymidi = require('easymidi')
const outputName = easymidi.getOutputs().filter(RegExp.prototype.test.bind(/FLUID/))[0]
if (!outputName) {
    throw new Error('No midi output matching /FLUID/ -- please turn on FluidSynth')
}
module.exports = new easymidi.Output(outputName)
