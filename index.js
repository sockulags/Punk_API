const apiUrl = "https://api.punkapi.com/v2/beers/random";
const imageNotFound = "not_found.png";
const container = document.querySelector("#container");
const previousBeerBtn = document.querySelector(".left-arrow-container");
const nextBeerBtn = document.querySelector(".right-arrow-container");
const audio = document.querySelector("audio");
const readMoreBtn = document.getElementById("read_more_button");
const randomBeerPage = document.querySelector(".random-beer-page");

const nextBeerSound = "another-one_dPvHt2Z.mp3";
const prevBeerSound = "ben-yes-made-with-Voicemod.mp3";

const viewedBeers = [];
const cachedBeers = {};

document.addEventListener("DOMContentLoaded", () => {
  loadNewBeer();
  setTimeout(showNextBeerBtn, 1000);
  nextBeerBtn.addEventListener("click", () => {
    playSound(nextBeerSound);
    setTimeout(loadNewBeer, 500);
  });
  previousBeerBtn.addEventListener("click", () => {
    playSound(prevBeerSound);
    setTimeout(loadPreviousBeer(), 500);
  }); 

  container.addEventListener("click", (e) => {
    if(e.target.parentElement.id == "read_more_button"){
        showBeerDetails();
    }

  })
});

function showBeerDetails() {
  console.log("Button is working")
}

function showNextBeerBtn() {
  nextBeerBtn.classList.remove("hider");
}

function playSound(soundSrc) {
  audio.src = soundSrc;
  audio.volume = 0.05;
  audio.play();
  console.log(readMoreBtn);
}

async function fetchRandomBeer() {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data[0]);
    return data[0];
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

async function loadNewBeer() {
  let randomBeer;
  do {
    randomBeer = await fetchRandomBeer();
  } while (cachedBeers[randomBeer.id] !== undefined);

  cacheBeers(randomBeer);
  container.innerHTML = beerCard(randomBeer);
}

function cacheBeers(beers) {
  cachedBeers[beers.id] = beers;
  viewedBeers.push(beers.id);
  if (viewedBeers.length > 1) {
    previousBeerBtn.classList.remove("hider");
  }
}

function loadPreviousBeer() {
  viewedBeers.pop();
  const previousBeerId = viewedBeers.pop();
  if (viewedBeers.length < 2) {
    previousBeerBtn.classList.add("hider");
  }
  const previousBeer = cachedBeers[previousBeerId];
  if (previousBeer) {
    container.innerHTML = beerCard(previousBeer);
  } else {
    console.error("Cached data not found for previous beer");
  }
}

function beerCard(randomBeer) {
  return `<div class="card" id="random-beer">
<div class="card-image" style="background-color:${randomHexColor()}">
  <img src="${randomBeer.image_url ?? imageNotFound}"/>
</div>
<div class="card-text">
  <h2>${randomBeer.name}</h2>
  <p>${randomBeer.tagline}</p>
  <div> 
  <div id="read_more_button" class="more"><span>Read more</span><span class="material-symbols-outlined see-more">
  read_more
  </span></div>
</div>
  </div>
</div>
`;
}

function randomHexColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
