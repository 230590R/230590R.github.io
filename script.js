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


// define buttons
let btnStart = document.getElementById("start");
let btnMusic = document.getElementById("music");
let btnBass = document.getElementById("bass");
let btnDrums = document.getElementById("drums");

let btnHam = document.getElementById("hambtn");

let music = new MusicLayer("audio/bgm-music.mp3", 0.25, 0.25);
let bass = new MusicLayer("audio/bgm-bass.mp3", 0, 0);
let drums = new MusicLayer("audio/bgm-drums.mp3", 0, 0);

btnStart.addEventListener('click', () => {
  music.audio.play();
  bass.audio.play();
  drums.audio.play();
})

btnHam.addEventListener('click', () => {
  alert("bozo");
})


btnMusic.addEventListener('click', function() { ToggleAudio(music, 0.25); });
btnBass.addEventListener('click', function() { ToggleAudio(bass, 1); });
btnDrums.addEventListener('click', function() { ToggleAudio(drums, 0.25); });

function ToggleAudio(a, volume) {
  a.maxvolume = (a.maxvolume == 0)
    ? volume  
    : 0;
}

const deltatime = 0.006;
function AppLoop(timestamp) {
  UpdateLoop(deltatime);
  // step into the next frame when frame time has elapsed
  requestAnimationFrame(AppLoop);
}


function UpdateLoop(dt) {
  music.Update(dt);
  bass.Update(dt);
  drums.Update(dt);
  let dtelement = document.getElementById("dt");
  dtelement.innerHTML = dt;
}




requestAnimationFrame(AppLoop);

//alert("bozo");

// while (true) {
//   music.Update();
//   bass.Update();
//   drums.Update();
// }