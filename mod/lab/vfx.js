const Z = -901

// states
const HIDDEN = 0
const WAIT = 1
const FADE_IN = 2
const KEEP = 3
const FADE_OUT = 4

const dft = {
    name: 'vfx', // important to have this name when fading a mod
    wait: 0,
    fadein: 1,
    keep: 1,
    fadeout: 1,
    state: WAIT,
    time: 0,
    fader: 0,
    color: '#000000',
}

function init() {
    this.state = HIDDEN
}

function flash() {
    this.locked = true

    this.transit({
        fadein:  .1,
        keep:    0,
        fadeout: 0.5,
        color:   '#ffffff',

        onHidden: function() {
            this.__.locked = false
        }
    }, true)
}

function transit(st, locked) {
    if (this.locked && !locked) {
        // in a locked transit right now
        // postpone for later
        defer(() => {
            lab.vfx.transit(st)
        }, 1)
        return
    }
    this.transition = {
        __: this,
    }
    augment(this.transition, dft, st)

    if (this.state === FADE_OUT) {
        this.state = FADE_IN
        this.fader = 1 - this.fader
        this.time = this.transition.fadein
    } else if (this.state === KEEP) {
        this.state = KEEP
        this.time = this.transition.keep
    } else {
        this.state = WAIT
        this.time = this.transition.wait
        this.fader = 1
        if (this.transition.onWait) this.transition.onWait()
    }
    // switch state forward if needed
    for (let i = 0; i < 4; i++) this.evo(0)
}

function evo(dt) {
    if (this.state === HIDDEN) return;

    this.fader = this.fader - dt / this.time;

    if (this.time === 0 || this.fader <= 0) {
          this.fader = 1;

          switch(this.state) {
          case WAIT:
                  this.state = FADE_IN;
                  this.time = this.transition.fadein;
                  if (this.transition.onFadeIn) this.transition.onFadeIn()
                  break;
          case FADE_IN:
                  this.state = KEEP;
                  this.time = this.transition.keep;
                  if (this.transition.onKeep) this.transition.onKeep()
                  break;
          case KEEP:
                  this.state = FADE_OUT;
                  this.time = this.transition.fadeout;
                  if (this.transition.onFadeOut) this.transition.onFadeOut()
                  break;
          case FADE_OUT:
                  if (this.transition.onHidden) this.transition.onHidden()
                  this.state = HIDDEN;
                  break;
          }
    }
}

function drawBackground() {
    pixelated();
    if (this.transition.image) {
        image(this.transition.image, 0, 0,
            this.__.rx(1), this.__.ry(1))
    } else {
        background(this.transition.color)
    }
}

function preVFX() {}

function drawContent() {
    /*
    fill('#ffffff')
    font(env.style.menuFont)
    alignCenter()
    baseMiddle()
    text( round((1-this.fader) * 10), rx(.5), ry(.5))

    let state = 'unknown'
    switch(this.state) {
        case WAIT: state     = 'wait';    break;
        case FADE_IN: state  = 'fadeIn';  break;
        case FADE_OUT: state = 'fadeOut'; break;
        case KEEP:     state = 'keep';    break; 
        case HIDDEN:   state = 'hidden';  break;
    }
    text( state, rx(.5), ry(.6))
    */
}

function postVFX() {
    if (this.state === HIDDEN || this.state === WAIT) return;

    save()
    switch (this.state) {
      case FADE_IN:
        alpha(1 - this.fader)
        break
      case KEEP:
        alpha(1)
        break
      case FADE_OUT:
        alpha(this.fader)
        break
    }

    this.drawBackground()
    this.drawContent()
    restore()
}
