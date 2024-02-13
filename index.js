const apiUrl = "https://api.punkapi.com/v2/beers/random";
const imageNotFound = "not_found.png";
const container = document.querySelector("#container");
const previousBeerBtn = document.querySelector(".left-arrow-container");
const nextBeerBtn = document.querySelector(".right-arrow-container");
const audio = document.querySelector("audio");
const readMoreBtn = document.getElementById("read_more_button");
const randomBeerPage = document.querySelector(".random-beer-page");
const beerInfoContainer = document.querySelector(".beer-info-container");
const randomBeerContainer = document.querySelector(".random-beer-page");

const nextBeerSound = "another-one_dPvHt2Z.mp3";
const prevBeerSound = "ben-yes-made-with-Voicemod.mp3";
let currentImgBgColor = "";

const viewedBeers = [];
const cachedBeers = {};

document.addEventListener("click", (e) => {
  const searchFormInput = document.getElementById("searchQuery");
  const searchResultsDiv = document.getElementById("results");
  const nextButton = document.getElementById("nextButton");
  const prevButton = document.getElementById("prevButton");

  if (!e.target.closest("aside")) {
    searchFormInput.value = "";
    searchResultsDiv.innerHTML = "";
    nextButton.disabled = true;
    prevButton.disabled = true;
    document.getElementById("pagination").classList.add("hider");
  }
});

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
    document.querySelector(".exit").classList.add("show");
  });
  beerInfoContainer.addEventListener("mouseleave", () => {
    document.querySelector(".exit").classList.remove("show");
  });
  beerInfoContainer.addEventListener("click", (e) => {
    if (e.target === document.querySelector(".exit")) {
      hideBeerDetails();
    }
  });
});

container.addEventListener("click", (e) => {
  if (e.target.parentElement.id === "read_more_button") {
    showBeerDetails();
  }
});
function showBeerDetails(id = null) {
  console.log("Button is working");
  const beer = id ?? viewedBeers[viewedBeers.length - 1];
  console.log(cachedBeers[beer]);
  beerInfoContainer.innerHTML = beerInfoCard(cachedBeers[beer]);
  randomBeerContainer.style.display = "none";
}


function hideBeerDetails() {
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
  const previousBeerId = viewedBeers[viewedBeers.length - 1];
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
  const foodPairings = beer.food_pairing
    .map((pairing) => pairing + "\n")
    .join("");
  const maltIngredients = beer.ingredients.malt.map((m) => m.name).join(", ");

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
      <p class="beer-desc"><strong>Description: </strong>${beer.description}</p>
      <div class="beer-info">
        <p><strong>Alcohol by volume:</strong> ${beer.abv}%</p>
        <p><strong>Volume:</strong> ${beer.volume.value} ${beer.volume.unit}</p>
        <p><strong>Hops:</strong> ${beer.ingredients.hops.map((hop) => hop.name).join(", ")}</p>
        <p><strong>Food pairing:</strong> ${foodPairings}</p>
        <p><strong>Ingridients: </strong> ${maltIngredients}</p>
      </div>
      <p class="beer-tips"><strong>Tips: </strong>${beer.brewers_tips}</p>
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

const resultsPerPage = 10;
let currentPage = 1;
let totalPages = 1;

let searchHistory = {};

document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  currentPage = 1;
  performSearch();
});

document.getElementById("searchQuery").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("searchForm").dispatchEvent(new Event("submit"));
  }
});

function performSearch() {
  let searchQuery = document.getElementById("searchQuery").value.trim();
  const apiUrl = `https://api.punkapi.com/v2/beers?beer_name=${searchQuery}`;

  searchQuery.replace(" ", "_");

  if (searchHistory[searchQuery]) {
    displayResults(searchHistory[searchQuery]);
  } else {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        searchHistory[searchQuery] = data;
        displayResults(data);
      })
      .catch((error) => console.error("Error:", error));
  }
}

function displayResults(data) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  if (data.length === 0) {
    resultsDiv.textContent = "No results found.";
    return;
  }
  const ul = createBeerList(data);
  resultsDiv.appendChild(ul);

  handlePagination(data.length);
  handleSearchResultList();
}

document.getElementById("nextButton").addEventListener("click", function () {
  currentPage++;
  const prevButton = document.getElementById("prevButton");
  if (currentPage > 1 && prevButton) {
    document.getElementById("prevButton").disabled = false;
  } else if (prevButton) {
    document.getElementById("prevButton").disabled = true;
  }
  performSearch();
});

document.getElementById("prevButton").addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    if (currentPage === 1) {
      document.getElementById("prevButton").disabled = true;
    }
    performSearch();
  }
});

const searchFormContainer = document.querySelector(".search-form");

function createBeerList(data) {
  const ul = document.createElement("ul");
  for (let i = (currentPage - 1) * resultsPerPage; i < Math.min(data.length, currentPage * resultsPerPage); i++) {
    const beer = data[i];
    const li = document.createElement("li");
    li.textContent = beer.name;
    cachedBeers[beer.id] = beer;
    li.addEventListener("click", () => showBeerDetails(beer.id));
    ul.appendChild(li);
  }
  return ul;
}

function handlePagination(dataLength) {
  totalPages = Math.ceil(dataLength / 10);
  if (totalPages === currentPage) {
    document.getElementById("nextButton").disabled = true;
  } else {
    document.getElementById("nextButton").disabled = false;
  }

  if (totalPages !== 1) {
    document.getElementById("pagination").classList.remove("hider");
  }
}

function handleSearchResultList() {
  let timeoutId;
  const searchList = searchFormContainer.querySelector("ul");
  searchList.classList.add("expanded");
  searchFormContainer.addEventListener("mouseenter", () => {
    if (searchList) searchList.classList.add("expanded");
    clearTimeout(timeoutId);
  });
  searchFormContainer.addEventListener("mouseleave", () => {
    timeoutId = setTimeout(() => {
      if (searchList) searchList.classList.remove("expanded");
    }, 1000);
  });
}
