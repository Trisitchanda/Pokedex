let currentPokemonId = null;

document.addEventListener("DOMContentLoaded", () => {
    const MAX_POKEMON = 300;
    const pokemon = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pokemon, 10);
    if (id < 1 || id > MAX_POKEMON) {
        return (window.location.href = "./poke.html")
    }
    currentPokemonId = id;
    loadPokemon(id)
})

async function loadPokemon(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
        ])

        const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail move")

        abilitiesWrapper.innerHTML = ""

        if (currentPokemonId == id) {
            displaypokemonDetails(pokemon)
            const flavourText = getEnglishFlavourText(pokemonSpecies)
            document.querySelector(".body3-fonts.pokemon-description").textConent = flavourText

            const [leftArrow, rightArrow] = ["#leftarrow", "rightarrow"].map((sel) => document.querySelector(sel))

            leftArrow.removeEventListener("click", navigatePokemon)
            rightArrow.removeEventListener("click", navigatePokemon)

            if (id !== 1) {
                leftArrow.addEventListener("click", () => {
                    navigatePokemon(id - 1)
                })
            }

            if (id !== MAX_POKEMON) {
                leftArrow.addEventListener("click", () => {
                    navigatePokemon(id + 1)
                })
            }

            window.history.pushState({}, "", `./detail.html.html?${id}`)
        }

        return true
    }
    catch (err) {
        console.error("An error occured while fetching pokemon data", err)
        return false
    }
}

async function navigatePokemon(id) {
    currentPokemonId = id
    await loadPokemon(id)
}

const typeColors = {
    normal: "linear-gradient(90deg, #A8A77A, #EDEDED)",
    fire: "radial-gradient(circle, #F08030, #FF4500)",
    water: "linear-gradient(180deg, #6890F0, #1E90FF)",
    electric: "linear-gradient(270deg, #F8D030, #FFD700)",
    grass: "linear-gradient(120deg, #78C850, #32CD32)",
    ice: "radial-gradient(circle, #98D8D8, #ADD8E6)",
    fighting: "linear-gradient(0deg, #C03028, #FF6347)",
    poison: "linear-gradient(90deg, #A33EA1, #8B008B)",
    ground: "linear-gradient(180deg, #E2BF65, #8B4513)",
    flying: "linear-gradient(270deg, #A98FF3, #87CEEB)",
    psychic: "linear-gradient(360deg, #F95587, #FF69B4)",
    bug: "linear-gradient(135deg, #A6B91A, #556B2F)",
    rock: "linear-gradient(90deg, #B6A136, #8B6C42)",
    ghost: "radial-gradient(circle, #735797, #4B0082)",
    dragon: "linear-gradient(0deg, #6F35FC, #8A2BE2)",
    dark: "linear-gradient(270deg, #705746, #2F4F4F)",
    steel: "linear-gradient(90deg, #B7B7CE, #A9A9A9)"
}

function setElementStyles(elements, cssproperty, value){
    elements.forEach((element)=>{
        element.style[cssproperty] = value
    })
}

function rgbFromHex(hexcolor){
    return[
        parseInt(hexcolor.slice(1, 3), 16), // Red
        parseInt(hexcolor.slice(3, 5), 16), // Red
        parseInt(hexcolor.slice(5, 7), 16), // Red
    ].join(", ")

    function setTypebackgroundcolor(pokemon){
        const mainType = pokemon.type[0].type.name;
        const color = typeColors[mainType]

        if(!color){
            console.warn(`color not defines for type :${mainType}`)
        }
        return
    }
}
