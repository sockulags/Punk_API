const apiUrl = "https://api.punkapi.com/v2/beers/random";
const imageNotFound = "not_found.png";
const container = document.querySelector("#container");
const previousBeerBtn = document.querySelector(".left-arrow-container");
const nextBeerBtn = document.querySelector(".right-arrow-container");
const audio = document.querySelector("audio");
const readMoreBtn = document.getElementById("read_more_button");
const randomBeerPage = document.querySelector(".random-beer-page");
const beerInfoContainer = document.querySelector('.beer-info-container');
const randomBeerContainer = document.querySelector('.random-beer-page');

const nextBeerSound = "another-one_dPvHt2Z.mp3";
const prevBeerSound = "ben-yes-made-with-Voicemod.mp3";
let currentImgBgColor = "";

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

  
  beerInfoContainer.addEventListener("mouseover", () => {
    document.querySelector('.exit').classList.add('show');
  })
  beerInfoContainer.addEventListener("mouseleave", () => {
    document.querySelector('.exit').classList.remove('show');
  })
  beerInfoContainer.addEventListener("click", (e)=> {
    if(e.target === document.querySelector('.exit')){
      hideBeerDetails()
    }
  })
});


container.addEventListener("click", (e) => {
  if(e.target.parentElement.id === "read_more_button"){
      showBeerDetails();
  }
})
function showBeerDetails() {
  console.log("Button is working")
  const beer = viewedBeers[viewedBeers.length-1];
  console.log(cachedBeers[beer])
  beerInfoContainer.innerHTML = beerInfoCard(cachedBeers[beer]);
  randomBeerContainer.style.display = "none";  
}

function hideBeerDetails(){
  beerInfoContainer.innerHTML = "";
  randomBeerContainer.style.display = "";  
}

function showNextBeerBtn() {
  nextBeerBtn.classList.remove("hider");
}

function playSound(soundSrc) {
  audio.src = soundSrc;
  audio.volume = 0.05;
  audio.play(); 
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
  const previousBeerId = viewedBeers[viewedBeers.length-1];
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

function beerInfoCard(beer) {
  const foodPairings = beer.food_pairing.map(pairing => pairing + "\n").join('');
  const maltIngredients = beer.ingredients.malt.map(m => m.name).join(', ');

  return `
    <div class="card">
    <div class="card-image" style="background-color:${currentImgBgColor}">
    <span class="material-symbols-outlined exit">close</span>
  <img src="${beer.image_url ?? imageNotFound}"/>
</div>  
      <div class="beer-name">
        <h2>${beer.name}</h2>
        <p>${beer.tagline}</p> 
      </div>                
      <p class="beer-desc">${beer.description}</p>
      <div class="beer-info">
        <p>Alcohol by volume: ${beer.abv}%</p>
        <p>Volume: 20litres</p>
        <p>Hops: ${beer.ingredients.hops.map(hop => hop.name).join(', ')}</p>
        <p>Food pairing: ${foodPairings}</p>
        <p>Ingredients: ${maltIngredients}</p>
      </div>
      <p class="beer-tips">"This beer is all about the balance between the malty backbone of the beer and the fresh hop aroma. The fresher the hops the better."</p>
    </div>`;
}


function randomHexColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  currentImgBgColor = color;
  return color;
}
