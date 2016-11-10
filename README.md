# Qwertsichord
Turn your qwerty keyboard into a fun musical instrument. No GUI. Linux only.

The ultimate goal: Raspberry pi + usb keyboard + usb speakers = amazing live performance = legions of adoring fans


## Prerequisites

- Linux Desktop, running X11 (with the `xev` utility)
- FluidSynth
- Nodejs 4+

## Setup

### Installation:

```sh
git clone https://github.com/twitchard/qwertsichord
cd qwertsichord
npm install
```

### Server
Currently qwertsichord is configured to detect and connect to a running instance of fluidsynth. So start that up:

```sh
fluidsynth /usr/share/soundfonts/FluidR3_GM.sf2 -s -a pulseaudio
```

### Execute
Qwertsichord doesn't source keyboard events itself, but relies on the `xev` utility and parses its output from standard input via [xev-emitter](https://github.com/twitchard/nodejs-xev-emitter). So you must have `xev` installed on your system and pipe its input into qwertsichord like so:

```sh
xev | node index.js
```

You may want to disable autorepeat.

```sh
xset r off
```


## Usage
Your right hand is a 'pipe'. It sounds one note at a time, and you basically count in binary to go up the C major scale.

E.g., your index finger alone is middle C. Your middle finger is the D above middle C. Your index finger plus your middle finger sounds the E above middle c, and so on and so forth. Further more, stretch your index finger towards the middle, and that key counts as a sharping key, and raises whatever note by a half step.

The left hand controls the 'drones'. These operate upon the same 'binary counting' principal, but hitting a combination of keys triggers the corresponding 'drone' to be sounded indefinitely, until the combination is pressed again to turn it off.

It's kind of a fun, bagpipe experience. Try playing "amazing grace" or something.
