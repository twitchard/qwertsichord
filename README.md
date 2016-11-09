# Qwertsichord
Turn your qwerty keyboard into a fun musical instrument. No GUI. Linux only.

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
Currently, you can play the notes in the C major scale by pressing the keys of the home row of my dvorak keyboard. That's it. Lame, right?

I'm still in the planning stages of how to make an interesting midi instrument out of a QWERTY keyboard. I am targeting an n-key rollover keyboard, since that is what I have. It would be cool to be able to have multiple voices, or support looping. Not exactly sure what I want.

If you have any ideas, I'd be interested in hearing them, and I encourage you to check out the code and play around with it.
