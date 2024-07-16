/*jshint esversion: 6*/

// class representing each layer of BGM.
class MusicLayer {
  constructor(filepath, maxvolume, volume = 0) {
    this.audio = new Audio(filepath);
    this.maxvolume = maxvolume;
    this.volume = volume;
    this.audio.volume = volume;
  }

  // eases the volume into the targeted volume
  Update(dt) {
    this.volume += (this.maxvolume - this.volume) * 5 * dt;
    this.audio.volume = this.volume;
  }
}


// class to encapsulate the cover parallax
class Cover {
  constructor() {
    // get the elements
    this.mountain = document.getElementById("title-mountain");
    this.ground = document.getElementById("title-ground");
    this.text = document.getElementById("title-h1");
    this.cover = document.getElementById("title-cover");
    // define the position of the title, set it
    this.textTop = -250;
    this.text.style.top = this.textTop + 'px';
  }

  // update function to be added to the scroll event listener
  ScrollUpdate(scrollY) {
    this.mountain.style.top = (scrollY * -0.75) + 'px';
    this.cover.style.top = (scrollY * -1) + 'px';
    let textPos = this.textTop + (scrollY * 0.005 * Math.abs(this.textTop));
    this.text.style.top = Math.min(textPos, 200) + 'px';
  }
}

// class to handle rounded corners
class Blob {
  constructor(target, start, range, timer) {
    // store the element to be changed
    this.target = target;
    // 4 element list of border radius floats
    this.borders = [start, start, start, start];
    this.tBorders = [0, 0, 0, 0];
    // variables to keep track of starting radius and range
    this.start = start;
    this.range = range;
    // variables to keep track of internal timer
    this.timer = timer;
    this.elapsed = timer;
  }

  Update(dt) {
    // tick up elapsed time
    this.elapsed += dt;
    // interpolate to the target size
    for (let i = 0; i < this.borders.length; i++) {
      this.borders[i] += (this.tBorders[i] - this.borders[i]) * dt / this.timer;
    }
    // snap to the nearest pixel, set the element's border-radius
    this.target.style.borderRadius =
      Math.floor(this.borders[0]) + "px " +
      Math.floor(this.borders[1]) + "px " +
      Math.floor(this.borders[2]) + "px " +
      Math.floor(this.borders[3]) + "px";
    
    // randomise a new target when timer is up
    if (this.elapsed >= this.timer) {
      for (let i = 0; i < this.tBorders.length; i++) {
        let rand = -(0.5 * this.range) + (Math.random() * this.range);
        this.tBorders[i] = this.start + rand;
      }
      this.elapsed = 0;
    }
  }
}

let cover = new Cover();
window.addEventListener('scroll', function () {
  cover.ScrollUpdate(window.scrollY);
});


// define buttons
let btnStart = document.getElementById("start");
let btnMusic = document.getElementById("music");
let btnBass = document.getElementById("bass");
let btnDrums = document.getElementById("drums");

let btnHam = document.getElementById("hambtn");
let hamblob = document.getElementById("hamblob");

let music = new MusicLayer("audio/bgm-music.mp3", 0.25, 0.25);
let bass = new MusicLayer("audio/bgm-bass.mp3", 0, 0);
let drums = new MusicLayer("audio/bgm-drums.mp3", 0, 0);

let hamicon = document.querySelector(".hamicon");

btnStart.addEventListener('click', () => {
  music.audio.play();
  bass.audio.play();
  drums.audio.play();
});

let navUL = document.querySelector("nav ul");
btnHam.addEventListener('click', () => {
  hamicon.classList.toggle("hamicon-toggled");
  hamblob.classList.toggle("hamblob-toggled");
  navUL.classList.toggle("hidden");
});


btnMusic.addEventListener('click', function() { ToggleAudio(music, 0.25); });
btnBass.addEventListener('click', function() { ToggleAudio(bass, 1); });
btnDrums.addEventListener('click', function() { ToggleAudio(drums, 0.25); });

function ToggleAudio(a, volume) {
  a.maxvolume = (a.maxvolume == 0) ? volume : 0;
}

const deltatime = 0.006;
function AppLoop() {
  UpdateLoop(deltatime);
  // step into the next frame when frame time has elapsed
  requestAnimationFrame(AppLoop);
}

let hamiconBlob = new Blob(btnHam, 20, 20, 0.25);
let hamiconBeforeBlob = new Blob(hamblob, 30, 30, 0.5);

function UpdateLoop(dt) {
  music.Update(dt);
  bass.Update(dt);
  drums.Update(dt);
  hamiconBlob.Update(dt);
  hamiconBeforeBlob.Update(dt);
}

requestAnimationFrame(AppLoop);

