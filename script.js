class MusicLayer {
  constructor(filepath, maxvolume, volume = 0) {
    this.audio = new Audio(filepath);
    this.maxvolume = maxvolume;
    this.volume = volume;
    this.audio.volume = volume;
  }
  Update() {
    this.volume += (this.maxvolume - this.volume) * 0.01;
    this.audio.volume = this.volume;
  }
}


// define buttons
let btnStart = document.getElementById("start");
let btnMusic = document.getElementById("music");
let btnBass = document.getElementById("bass");
let btnDrums = document.getElementById("drums");

let music = new MusicLayer("audio/bgm-music.mp3", 0.25, 0.25);
let bass = new MusicLayer("audio/bgm-bass.mp3", 0, 0);
let drums = new MusicLayer("audio/bgm-drums.mp3", 0, 0);

btnStart.addEventListener('click', () => {
  music.audio.play();
  bass.audio.play();
  drums.audio.play();
})




btnMusic.addEventListener('click', function() { ToggleAudio(music, 0.25); });
btnBass.addEventListener('click', function() { ToggleAudio(bass, 1); });
btnDrums.addEventListener('click', function() { ToggleAudio(drums, 0.25); });

function ToggleAudio(a, volume) {
  a.maxvolume = (a.maxvolume == 0)
    ? volume  
    : 0;
}


function loop() {
  requestAnimationFrame(loop);
  music.Update();
  bass.Update();
  drums.Update();
}

requestAnimationFrame(loop);

alert("bozo");

// while (true) {
//   music.Update();
//   bass.Update();
//   drums.Update();
// }