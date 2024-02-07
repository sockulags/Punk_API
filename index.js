const apiUrl= "https://api.punkapi.com/v2/beers/random";
const imageNotFound = "not_found.png";
const container = document.querySelector("#container");

async function fetchData(){
try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }  
    const data = await response.json();
    console.log(data[0]);
    return data[0];
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

const randomBeer = await fetchData();
container.innerHTML = beerCard(randomBeer);



function beerCard(randomBeer) {
    return `<div class="card" id="random-beer">
<div class="card-image" style="background-color:${randomHexColor()}">
  <img src="${randomBeer.image_url ?? imageNotFound}"/>
</div>
<div class="card-text">
  <h2>${randomBeer.name}</h2>
  <p>${randomBeer.tagline}</p>
  <div> 
  <div class="more"><span>Read more</span><span class="material-symbols-outlined see-more">
  read_more
  </span></div>
</div>
  </div>
</div>
`
}

function randomHexColor() {    
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

