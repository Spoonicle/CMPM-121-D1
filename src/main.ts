// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.

// @deno-types="./asset-url.d.ts"
import terran_planet from "./assets/Terran.png?no-inline";
import lava_planet from "./assets/Lava.png?no-inline";
import ice_planet from "./assets/Ics.png?no-inline";
import bare_planet from "./assets/Baren.png?no-inline";
import black_hole from "./assets/Black_hole.png?no-inline";

interface Planet {
  name: string,
  cost: number,
  image: string,
  soldier_count: number,
  conquered: boolean;
}

const app = document.querySelector<HTMLElement>("#app")!;

const game = document.createElement("div");
game.className = "game";

let soldiers = 0;

const soldier_count = document.createElement("h2");
soldier_count.textContent = `Soldiers: ${soldiers}`; // text to show soldier count

const soldier_camp = document.createElement("div");
soldier_camp.className = "camp";

// array of planets
const planets: Planet[] = [
  {name: "Terran", cost: 350, image: terran_planet, conquered: false},
  {name: "Lava", cost: 1000, image: lava_planet, conquered: false},
  {name: "Ice", cost: 3250, image: ice_planet, conquered: false},
  {name: "Bare", cost: 8840, image: bare_planet, conquered: false},
  {name: "Black Hole", cost: 50000, image: black_hole, conquered: false},
]

// set init planet to planets[0]
const planet = document.createElement("img")
planet.className = "planet";
planet.src = planets[0].image;
planet.alt = planets[0].name;

// game buttons
const enlist_button = document.createElement("button");
enlist_button.className = "enlist_button";
enlist_button.textContent = "Enlist";

const conquer_button = document.createElement("button");
conquer_button.className = "conquer_button";
conquer_button.textContent = "Conquer";

// add soldier and update text
enlist_button.addEventListener("click", () => {
  soldiers++;
  soldier_count.textContent = `Soldiers: ${soldiers}`;
  console.log(`Soldiers: ${soldiers}`);
});

// conquer button
let current_planet = 0;
conquer_button.addEventListener("click", () => {
  const selected_planet = planets[current_planet];

  if (selected_planet.conquered) {
    console.log("Already conquered");
    return;
  }

  if (soldiers < selected_planet.cost) {
    console.log("Not enough soldiers to conquer");
    return;
  }

  soldiers -= selected_planet.cost;
  selected_planet.conquered = true;

  soldier_count.textContent = `Soldiers: ${soldiers}`;

  console.log(`${selected_planet.name} has been conquered`);
})

const top_selection = document.createElement("div");
top_selection.className = "top_section";

top_selection.append(soldier_camp, planet);

game.append(soldier_count, top_selection, enlist_button);

app.append(game);
