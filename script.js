/*jshint esversion: 6 */
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

let music = new MusicLayer("audio/bgm-music.mp3", 0.25, 0.25);
let bass = new MusicLayer("audio/bgm-bass.mp3", 0, 0);
let drums = new MusicLayer("audio/bgm-drums.mp3", 0, 0);

let hamicon = document.querySelector(".hamicon");

btnStart.addEventListener('click', () => {
  music.audio.play();
  bass.audio.play();
  drums.audio.play();
});

btnHam.addEventListener('click', () => {
  hamicon.classList.toggle("hamicon-toggled");
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


function UpdateLoop(dt) {
  music.Update(dt);
  bass.Update(dt);
  drums.Update(dt);
}




requestAnimationFrame(AppLoop);

