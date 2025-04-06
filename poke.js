const MAX_POKEMON = 500;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-ip");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notfoundmsg = document.querySelector("#not-found-msg");
const closeBtn = document.querySelector(".search-close-icon")

let allpokemon = []

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        allpokemon = data.results;
        console.log(allpokemon)
        displaypokemon(allpokemon)
    });

async function fetchPokemonDataBeforRedirect(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
        ])
        return true
    } catch (error) {
        console.error("failed to  fetch pokemon data before redirect!");
    }
}

function displaypokemon(pokemon) {
    listWrapper.innerHTML = ""

    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.classList.add("list-item");
        listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
        </div>
        <div class="img-wrap">
        <p class="body3-fonts">#${pokemon.name}</p>
        </div>
        `;

        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforRedirect(pokemonID)
            if (success) {
                window.location.href = `detail.html?id=${pokemonID}`;
            }
        });

        listWrapper.appendChild(listItem)
    })
}

searchInput.addEventListener("keyup", handleSerch)

function handleSerch() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredpokemons;
    if (numberFilter.checked) {
        filteredpokemons = allpokemon.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchTerm)
        })
    } else if (nameFilter.checked) {
        filteredpokemons = allpokemon.filter((pokemon) => {
            return pokemon.name.toLowerCase().startsWith(searchTerm)
        })
    } else {
        filteredpokemons = allpokemon;
    }
    displaypokemon(filteredpokemons)

    if (filteredpokemons.length === 0) {
        notfoundmsg.style.display = "block"
    }else{
        notfoundmsg.style.display = "none"
    }
}

closeBtn.addEventListener("click", clearSearch)

function clearSearch(){
    searchInput.value = ""
    displaypokemon(allpokemon)
    notfoundmsg.style.display = "none"
}