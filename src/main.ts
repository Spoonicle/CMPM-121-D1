// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

import Terran from "./assets/Terran.png";
import Ice from "./assets/Ice.png";
import Lava from "./assets/Lava.png";
import Baren from "./assets/Baren.png";
import Black_hole from "./assets/Black_hole.png";

const app = document.querySelector<HTMLElement>("#app")!;

const game = document.createElement("div");
game.className = "game";

let soldiers = 0;

const soldier_count = document.createElement("h2");
soldier_count.textContent = `Soldiers: ${soldiers}`; // text to show soldier count

const soldier_camp = document.createElement("div");
soldier_camp.className = "camp";

const planetsList = [
  Terran,
  Ice,
  Lava,
  Baren,
  Black_hole,
];

for (let i = 0; i < planetsList.length; i++) {
  const planet = document.createElement("img");
  planet.className = "planet";
  planet.src = planetsList[i];
  planet.alt = planetsList[i];
  soldier_camp.append(planet);
}

const enlist_button = document.createElement("button");
enlist_button.className = "enlist_button";
enlist_button.textContent = "Enlist";

// add soldier and update text
enlist_button.addEventListener("click", () => {
  soldiers++;
  soldier_count.textContent = `Soldiers: ${soldiers}`;
});

const top_selection = document.createElement("div");
top_selection.className = "top_section";

top_selection.append(soldier_camp, planetsList);

game.append(soldier_count, top_selection, enlist_button);

app.append(game);
