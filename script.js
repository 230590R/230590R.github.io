/*jshint esversion: 6 */

function Lerp(a, b, t) {
  return a + (b - a) * t;
}


class MusicLayer {
  constructor(filepath, maxvolume, volume = 0) {
    this.audio = new Audio(filepath);
    this.maxvolume = maxvolume;
    this.volume = volume;
    this.audio.volume = volume;
  }
  Update(dt) {
    this.volume += (this.maxvolume - this.volume) * 5 * dt;
    this.audio.volume = this.volume;
  }
}



// class to encapsulate the cover parallax
class Cover {
  constructor() {
    this.mountain = document.getElementById("title-mountain");
    this.ground = document.getElementById("title-ground");
    this.text = document.getElementById("title-h1");
    this.cover = document.getElementById("title-cover");
    
    // define the position of the title, set it
    this.textTop = -250;
    this.text.style.top = this.textTop + 'px';
  }
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
    this.start = Number(start);
    this.borders = [start, start, start, start];
    this.tBorders = [0, 0, 0, 0];

    this.range = Number(range);
    this.target = target;
    this.timer = Number(timer);
    this.elapsed = Number(timer);
  }
  Update(dt) {
    this.elapsed += dt;

    for (let i = 0; i < this.borders.length; i++) {
      this.borders[i] += (this.tBorders[i] - this.borders[i]) * dt / this.timer;
    }

    this.target.style.borderRadius =
      Math.floor(this.borders[0]) + "px " +
      Math.floor(this.borders[1]) + "px " +
      Math.floor(this.borders[2]) + "px " +
      Math.floor(this.borders[3]) + "px";

    
    
    
    if (this.elapsed < this.timer)
      return;
    // randomize again
    this.elapsed = 0;
    for (let i = 0; i < this.tBorders.length; i++) {
      let rand = -this.range + (Math.random() * this.range * 2);
      this.tBorders[i] = this.start + rand;
    }


    
    let targetborder =
      // Math.floor(this.borders[0].toString()) + "px " +
      // Math.floor(this.borders[1].toString()) + "px " +
      // Math.floor(this.borders[2].toString()) + "px " +
      Math.floor(this.borders[3].toString()) + "px";
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

let navUL = document.querySelector("nav ul")
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



let hamiconBlob = new Blob(btnHam, 20, 10, 0.5);
let hamiconBeforeBlob = new Blob(hamblob, 30, 15, 0.5);

function UpdateLoop(dt) {
  music.Update(dt);
  bass.Update(dt);
  drums.Update(dt);
  hamiconBlob.Update(dt);
  hamiconBeforeBlob.Update(dt);
}





requestAnimationFrame(AppLoop);

