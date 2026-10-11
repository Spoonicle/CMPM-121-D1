// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

import Terran from "./assets/Terran.png";
import Ice from "./assets/Ice.png";
import Lava from "./assets/Lava.png";
import Baren from "./assets/Baren.png";
import Black_hole from "./assets/Black_hole.png";

interface Planet {
  name: string,
  cost: number,
  image: string,
  soldier_count: number,
  conquered: boolean,
  display: boolean,
}

const app = document.querySelector<HTMLElement>("#app")!;

const game = document.createElement("div");
game.className = "game";

let soldiers = 0;

const soldier_count = document.createElement("h2");
soldier_count.textContent = `Soldiers: ${soldiers}`; // text to show soldier count

const soldier_camp = document.createElement("div");
soldier_camp.className = "camp";

// set array of planets
const planets: Planet[] = [
  {name: "Terran", cost: 350, image: Terran, soldier_count: 0, conquered: false, display: false},
  {name: "Lava", cost: 1000, image: Lava, soldier_count: 0, conquered: false, display: false},
  {name: "Ice", cost: 3250, image: Ice, soldier_count: 0, conquered: false, display: false},
  {name: "Baren", cost: 8840, image: Baren, soldier_count: 0, conquered: false, display: false},
  {name: "Black Hole", cost: 50000, image: Black_hole, soldier_count: 0, conquered: false, display: false},
]

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
});

let current_planet = 0;
conquer_button.addEventListener("click", () => {
  const selected_planet = planets[current_planet];

  if (selected_planet.conquered) {
    console.log("Planet has already been conquered");
    return;
  }

  if (soldiers < selected_planet.cost) {
    console.log("Not enough troop to conquer");
    return;
  }

  soldiers -= selected_planet.cost;
  selected_planet.conquered = true;

  soldier_count.textContent = `Soldiers: ${soldiers}`;

  console.log(`${selected_planet.name} has been conquerd`);
})

const top_selection = document.createElement("div");
top_selection.className = "top_section";

const planet_container = document.createElement("div");
planet_container.className = "planet_container";

// adding planets to the container
for (let i = 0; i < planets.length; i++) {
  const planet = document.createElement("img");

  planet.className = "planet";
  planet.src = planets[i].image;
  planet.alt = planets[i].name;

  planet_container.append(planet);
}

top_selection.append(soldier_camp, planet_container);

game.append(soldier_count, top_selection, enlist_button);

app.append(game);
