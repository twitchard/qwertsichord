# Qwertsichord
Turn your qwerty keyboard into a fun musical instrument. No GUI. Linux only.

The ultimate goal: Raspberry pi + usb keyboard + usb speakers = amazing live performance = legions of adoring fans

## Prerequisites

- X.org and the the `xev` utility (on Archlinux, `pacman -S xorg-xev`)
- FluidSynth (on Archlinux, `pacman -S fluidsynth`)
- FluidSynth soundfonts (on Archlinux, `pacman -S soundfont-fluid`)
- Nodejs 4+ (on Archlinux, `pacman -S nodejs` -- or use [nvm](https://github.com/creationix/nvm) )

## Setup

### Quick start:

#### Start fluidsynth
The command I use is this -- customize appropriately for your system:
```sh
fluidsynth /usr/share/soundfonts/FluidR3_GM.sf2 -s -a pulseaudio
```

#### Install qwertsichord

As an npm global module:
```sh
npm install -g qwertsichord
xev | qwertsichord
```

Via git (better for tinkering):
```sh
git clone https://github.com/twitchard/qwertsichord
cd qwertsichord
npm install
xev | node bin/qwertsichord.js
```

#### Hints
You may want to disable autorepeat.
```sh
xset r off
```


## Usage
Your right hand is a 'pipe'. It sounds one note at a time, and you basically count in binary to go up the C major scale.

E.g., your index finger alone is middle C. Your middle finger is the D above middle C. Your index finger plus your middle finger sounds the E above middle c, and so on and so forth. Further more, stretch your index finger towards the middle, and that key counts as a sharping key, and raises whatever note by a half step.

The left hand controls the 'drones'. These operate upon the same 'binary counting' principal, but hitting a combination of keys triggers the corresponding 'drone' to be sounded indefinitely, until the combination is pressed again to turn it off.

It's kind of a fun, bagpipe experience. Try playing "amazing grace" or something.
