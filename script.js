/*jshint esversion: 6 */

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
    this.x = 10; this.y = -20; // position
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

    // update the z index
    this.penguin.style.zIndex = 200 + Math.floor(this.y);

    this.timer -= dt;
    if (this.timer <= 0)
      this.NewWaypoint();
  }
  // 
  NewWaypoint() {
    let ww = window.innerWidth;
    this.tx = 0 + (Math.random() * ww);
    this.ty = 100 -(0.5 * 20) + (Math.random() * 40);
    this.timer = (15 + (Math.random() * 15)) / 10;

    this.flip = (this.x < this.tx) ? -1 : 1;
  }
}

// class to encapsulate footer functionality
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
    penguinElement.classList.add("penguin");
    penguinElement.appendChild(img);
    penguinElement.appendChild(label);

    // append the penguin into the footer
    this.container.appendChild(penguinElement);
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

// class to encapsulate navbar functionality
class Navbar {
  constructor() {
    // hamburger elements
    let btnHam = document.getElementById("hambtn");
    let hamblob = document.getElementById("hamblob");
    let hamicon = document.querySelector(".hamicon");
    // init nav event listener
    let navUL = document.querySelector("nav ul");
    btnHam.addEventListener('click', function () {
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
  
  }
  Update(dt) {
    this.hamiconBlob.Update(dt);
    this.hamiconBeforeBlob.Update(dt);
  }
}

function ToggleFullscreen() {
  if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
    // exit fullscreen
    if (document.exitFullscreen) // request exit fullscreen
    document.exitFullscreen();
  else if (document.mozCancelFullScreen) // firefox
    document.mozCancelFullScreen();
  else if (document.webkitExitFullscreen) // chrome safari and opera
    document.webkitExitFullscreen();
  else if (document.msExitFullscreen)   // internet explorer and edge
    document.msExitFullscreen();
  }
  else {
    // enter fullscreen
    if (document.documentElement.requestFullscreen) // request fullscreen
    document.documentElement.requestFullscreen();
  else if (document.documentElement.mozRequestFullScreen) // firefox
    document.documentElement.mozRequestFullScreen();
  else if (document.documentElement.webkitRequestFullscreen) // chrome safari and opera
    document.documentElement.webkitRequestFullscreen();
  else if (document.documentElement.msRequestFullscreen) // internet explorer and edge
    document.documentElement.msRequestFullscreen();
  }
}
// create the footer object, add the event listeners
let footer = new Footer();
footer.btnAge.addEventListener('click', function () { footer.ToggleAge(); });
document.getElementById("submit").addEventListener('click', function () { footer.ConstructPenguin(); });
document.querySelector("footer h2").addEventListener('click', ToggleFullscreen);

// create the slider object, add the event listeners
let slider = new Slider();
document.querySelector(".slides .prev").addEventListener('click', function () {slider.Slide(-1);});
document.querySelector(".slides .next").addEventListener('click', function () {slider.Slide(1);});

// create the cover object, add the event listeners
let cover = new Cover();
window.addEventListener('scroll', function () {cover.ScrollUpdate(window.scrollY);});

// create the navbar and subpage buttons
let navbar = new Navbar();
let subpageButtons = [
  document.getElementById("page1btn"),
  document.getElementById("page2btn"),
  document.getElementById("page3btn")
];

for (let n = 0; n < subpageButtons.length; n++) {
  const i = n;   // functions declared within loops referencing an outer scoped variable may lead to confusing semantics
  const nav = navbar;
  const subpgbtn = subpageButtons;
  // add event listeners for each button
  subpageButtons[i].addEventListener('click', () => {
    nav.ToggleSubpage(i);
    for (let j = 0; j < subpgbtn.length; j++) {
      if (j === i) subpgbtn[j].classList.add("button-toggled");
      else subpgbtn[j].classList.remove("button-toggled");
    }
    setTimeout(function () { nav.HideSubpages(i); }, 201);
  });
}


let prevTimestamp = 0;
function AppLoop(timestamp) {
  // calculate dt
  let dt = (timestamp - prevTimestamp) / 1000;
  prevTimestamp = timestamp; 
  
  // update the necessary objects
  navbar.Update(dt);
  footer.Update(dt);

  // step into the next frame when frame time has elapsed
  requestAnimationFrame(AppLoop);
}

requestAnimationFrame(AppLoop);