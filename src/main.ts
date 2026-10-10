// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const game = document.createElement("div");
game.className = "game";

let soldiers = 0;

const soldier_count = document.createElement("h2");
soldier_count.textContent = `Soldiers: ${soldiers}`; // text to show soldier count

const soldier_camp = document.createElement("dic");
soldier_camp.className = "camp";

// later change this to array of planets
// for now only one to see on screen
const planet = document.createElement("div")
planet.className = "planet";
planet.textContent = "🟠";

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

top_section.append(camp, planet);

game.append(soldier_count, top_section, enlist_button);

app.append(game);
