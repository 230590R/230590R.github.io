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
    //this.cover.style.top = (scrollY * -1) + 'px';
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


// class to encapsulate slider functionality 
class Slider {
  constructor() {
    this.slides = document.querySelectorAll(".slides .slide");
    this.selectortitle = document.getElementById("species-name");
    this.slidenames = ["Emperor", "Adelie", "Rockhopper"];
    this.index = 0;

    // hide all slides except the first
    for (let i = 0; i < this.slides.length; i++) {
      this.slides[i].classList.add("hiddenslide");
    }
    this.slides[this.index].classList.remove("hiddenslide");

  }
  // function to move between slides, to be attached to the button event listener
  Slide(offset) {
    // store the index of the previous and next slides
    let prev = this.index;

    // change the index
    this.index += offset;
    if (this.index < 0) this.index = this.slides.length - 1;
    else if (this.index >= this.slides.length) this.index = 0;

    // hide the previous slide
    this.slides[prev].classList.add("hiddenslide");

    // show the current slide
    this.slides[this.index].classList.remove("hiddenslide");
    this.selectortitle.innerHTML = this.slidenames[this.index];
  }

}


// class to represent penguin objects
class Penguin {
  constructor(penguin, sprite) {
    this.x = 200; this.y = 0; // position
    this.tx = 200; this.ty = 100;
    this.flip = 1; // scale, -1 to flip 
    this.penguin = penguin; // reference to the element
    this.sprite = sprite;
    this.timer = 0;
  }
  // update function: update the penguin's position
  Update(dt) {
    // update the element to its target
    this.x += (this.tx - this.x) * dt;
    this.y += (this.ty - this.y) * dt;

    // change the element pos, image rotate
    let pos = "translate(" + Math.floor(this.x) + "px, " + Math.floor(this.y) + "px)"; 
    this.penguin.style.transform = pos;
    this.sprite.style.transform = "scale(" + this.flip + ", 1)";

    this.timer -= dt;
    if (this.timer <= 0)
      this.NewWaypoint();
  }
  // 
  NewWaypoint() {
    let ww = window.innerWidth;
    this.tx = 0 + (Math.random() * ww);
    this.ty = 100 -(0.5 * 20) + (Math.random() * 40);
    this.timer = 2;

    this.flip = (this.x < this.tx) ? -1 : 1;
  }
}

class Footer {
  constructor() {
    this.btnAge = document.getElementById("pet-age-selector");
    this.container = document.querySelector(".penguin-container");
    // variables for constructing
    this.age = "adult";
    this.species = "emperor";
    this.name = "placeholder";
    this.penguins = [];

    this.inputName = document.getElementById("pet-name");
    this.inputSpecies = document.getElementById("pet-species");
    this.name = this.inputName.value;
    this.species = this.inputSpecies.value;
  }
  ToggleAge() {
    let tempAge = (this.btnAge.innerHTML === "Adult") ? "Chick" : "Adult";
    this.btnAge.innerHTML = tempAge;
    this.age = tempAge;
  }

  // penguin element constructor
  ConstructPenguin() {
    let filepath = "images/spr-" + this.species;
    if (this.age === "Chick") filepath += "-chick";
    filepath += ".png";

    // create the image element
    let img = document.createElement('img');
    img.src = filepath;
    img.alt = this.species + " " + this.age;

    // create the name element
    let label = document.createElement('p');
    label.innerHTML = this.name;

    // create the penguin element, append the img and name
    let penguinElement = document.createElement('div');
    penguinElement.classList.add("penguin")
    penguinElement.appendChild(img);
    penguinElement.appendChild(label);

    // append the penguin into the footer
    this.container.appendChild(penguinElement);

    // add penguin into the list
    this.penguins.push(new Penguin(penguinElement, img));
  }
  // update function
  Update(dt) {
    // read the form inputs and update variables
    this.name = this.inputName.value;
    this.species = this.inputSpecies.value;

    // update the position of all penguins
    for (let i = 0; i < this.penguins.length; i++) {
      this.penguins[i].Update(dt);
    }
  }
}


let footer = new Footer();

footer.btnAge.addEventListener('click', function () { footer.ToggleAge(); });
document.getElementById("submit").addEventListener('click', function () {
  footer.ConstructPenguin();
});


let slider = new Slider();

document.querySelector(".slides .prev").addEventListener('click', function () {
  slider.Slide(-1);
});

document.querySelector(".slides .next").addEventListener('click', function () {
  slider.Slide(1);
});

let cover = new Cover();
window.addEventListener('scroll', function () {
  cover.ScrollUpdate(window.scrollY);
});

let music = new MusicLayer("audio/bgm-music.mp3", 0.25, 0.25);
let bass = new MusicLayer("audio/bgm-bass.mp3", 0, 0);
let drums = new MusicLayer("audio/bgm-drums.mp3", 0, 0);

// class to encapsulate navbar functionality
class Navbar {
  constructor() {
    // hamburger elements
    let btnHam = document.getElementById("hambtn");
    let hamblob = document.getElementById("hamblob");
    let hamicon = document.querySelector(".hamicon");
    // init nav event listener
    let navUL = document.querySelector("nav ul");
    btnHam.addEventListener('click', () => {
      hamicon.classList.toggle("hamicon-toggled");
      hamblob.classList.toggle("hamblob-toggled");
      navUL.classList.toggle("hidden");
    });
    // create the hamicon blob
    this.hamiconBlob = new Blob(btnHam, 20, 20, 0.25);
    this.hamiconBeforeBlob = new Blob(hamblob, 30, 30, 0.5);
    // subpage elements
    this.subpages = [
      document.getElementById("introduction"),
      document.getElementById("species"),
      document.getElementById("game"),
    ];
  }

  // to be invoked once after the transition is played
  HideSubpages(index) {
    // hide all other subpages
    for (let i = 0; i < this.subpages.length; i++) {
      if (i === index) continue;
      this.subpages[i].classList.add("displaynone");
    }
    this.subpages[index].classList.remove("hidden-subpage");
  }

  ToggleSubpage(index) {
    // hide all other subpages
    for (let i = 0; i < this.subpages.length; i++) {
      this.subpages[i].classList.add("hidden-subpage");
    }
    this.subpages[index].classList.remove("displaynone");

    // scroll to view
    document.getElementById("content-anchor").scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
  
    // set the music
    if (index == 0) {
      music.maxvolume = 0;
      bass.maxvolume = 1;
      drums.maxvolume = 0;
    }
    else if (index == 1) {
      music.maxvolume = 1;
      bass.maxvolume = 1;
      drums.maxvolume = 0;
    }
    else if (index == 2) {
      music.maxvolume = 1;
      bass.maxvolume = 1;
      drums.maxvolume = 1;
    }

  }
  Update(dt) {
    this.hamiconBlob.Update(dt);
    this.hamiconBeforeBlob.Update(dt);
  }
}


let navbar = new Navbar();

let btnIntro = document.getElementById("page1btn");
let btnSpecies = document.getElementById("page2btn");
let btnGame = document.getElementById("page3btn");

btnIntro.addEventListener('click', function () {
  navbar.ToggleSubpage(0);
  btnIntro.classList.add("button-toggled");
  btnSpecies.classList.remove("button-toggled");
  btnGame.classList.remove("button-toggled");

  setTimeout(function () {
    navbar.HideSubpages(0);
  }, 201);
});

btnSpecies.addEventListener('click', function () {
  navbar.ToggleSubpage(1);
  btnIntro.classList.remove("button-toggled");
  btnSpecies.classList.add("button-toggled");
  btnGame.classList.remove("button-toggled");

  setTimeout(function () {
    navbar.HideSubpages(1);
  }, 201);
});

btnGame.addEventListener('click', function () {
  navbar.ToggleSubpage(2);
  btnIntro.classList.remove("button-toggled");
  btnSpecies.classList.remove("button-toggled");
  btnGame.classList.add("button-toggled");

  setTimeout(function () {
    navbar.HideSubpages(2);
  }, 201);

});


let btnStart = document.getElementById("start");
let btnMusic = document.getElementById("music");
let btnBass = document.getElementById("bass");
let btnDrums = document.getElementById("drums");



btnStart.addEventListener('click', function () {
  music.audio.play();
  bass.audio.play();
  drums.audio.play();
});


btnMusic.addEventListener('click', function () { ToggleAudio(music, 0.25); });
btnBass.addEventListener('click', function () { ToggleAudio(bass, 1); });
btnDrums.addEventListener('click', function () { ToggleAudio(drums, 0.25); });

function ToggleAudio(a, volume) {
  a.maxvolume = (a.maxvolume == 0) ? volume : 0;
}

const deltatime = 0.006;
function AppLoop() {
  music.Update(deltatime);
  bass.Update(deltatime);
  drums.Update(deltatime);

  navbar.Update(deltatime);
  footer.Update(deltatime);

  // step into the next frame when frame time has elapsed
  requestAnimationFrame(AppLoop);
}

requestAnimationFrame(AppLoop);