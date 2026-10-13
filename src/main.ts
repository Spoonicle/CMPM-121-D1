// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

import Terran from "./assets/Terran.png";
import Ice from "./assets/Ice.png";
import Lava from "./assets/Lava.png";
import Baren from "./assets/Baren.png";
import Black_hole from "./assets/Black_hole.png";
import BlackSoldier from "./assets/Black_Soldier.png";

import {
  create_soldier_sprite,
  planet_auto_click,
  planet_auto_loss,
  update_planet_display,
} from "./functions.ts";
import type { Planet } from "./functions.ts";

const app = document.querySelector<HTMLElement>("#app")!;

const game = document.createElement("div");
game.className = "game";

let soldiers = 0;

const soldier_sprite = document.createElement("div");
soldier_sprite.className = "soldier_sprite";
soldier_sprite.style.backgroundImage = `url(${BlackSoldier})`;

// set array of planets
const planets: Planet[] = [
  {
    name: "Terran",
    cost: 100,
    image: Terran,
    soldier_count: 0,
    conquered: false,
    display: false,
    auto_soldier: 1,
    auto_soldier_loss: 0,
  },
  {
    name: "Lava",
    cost: 120,
    image: Lava,
    soldier_count: 0,
    conquered: false,
    display: false,
    auto_soldier: 2,
    auto_soldier_loss: 4,
  },
  {
    name: "Ice",
    cost: 130,
    image: Ice,
    soldier_count: 0,
    conquered: false,
    display: false,
    auto_soldier: 3,
    auto_soldier_loss: 6,
  },
  {
    name: "Baren",
    cost: 140,
    image: Baren,
    soldier_count: 0,
    conquered: false,
    display: false,
    auto_soldier: 4,
    auto_soldier_loss: 8,
  },
  {
    name: "Black Hole",
    cost: 150,
    image: Black_hole,
    soldier_count: 0,
    conquered: false,
    display: false,
    auto_soldier: 5,
    auto_soldier_loss: 10,
  },
];

const camp_section = document.createElement("div");
camp_section.className = "camp_section";

const soldier_count = document.createElement("h2");
soldier_count.className = "soldier_count";
soldier_count.textContent = "Soldiers:";

const soldier_camp = document.createElement("div");
soldier_camp.className = "soldier_camp";

const action_buttons = document.createElement("div");
action_buttons.className = "action_buttons";

const transport_button = document.createElement("button");
transport_button.className = "action_btn transport_button";
transport_button.textContent = "Transport";
transport_button.addEventListener("click", () => {
  console.log("Transport clicked");
});

const enlist_button = document.createElement("button");
enlist_button.className = "action_btn enlist_button";
enlist_button.textContent = "Enlist";

const conquer_button = document.createElement("button");
conquer_button.className = "action_btn conquer_button";
conquer_button.textContent = "Conquer";

// add soldier and update text
enlist_button.addEventListener("click", () => {
  soldiers++;
  soldier_count.textContent = `Soldiers: ${soldiers}`;
  soldier_camp.append(create_soldier_sprite(BlackSoldier));
  update_planet_display(planets, planet_images, soldiers);
});

let current_planet = 0;
conquer_button.addEventListener("click", () => {
  const selected_planet = planets[current_planet];

  if (selected_planet.conquered) {
    console.log(`${selected_planet.name} has already been conquered`);
    return;
  }

  if (soldiers < selected_planet.cost) {
    console.log(
      `Not enough troops to conquer the planet: ${selected_planet.name}`,
    );
    return;
  }

  soldiers -= selected_planet.cost;
  selected_planet.soldier_count += selected_planet.cost;
  selected_planet.conquered = true;
  soldier_count.textContent = `Soldiers: ${soldiers}`;
  update_planet_display(planets, planet_images, soldiers);
  console.log(`${selected_planet.name} has been conquered`);
});

action_buttons.append(transport_button, enlist_button, conquer_button);

camp_section.append(soldier_camp, soldier_count);

const upgrades_shelf = document.createElement("div");
upgrades_shelf.className = "upgrades_shelf";

const upgrades_title = document.createElement("h3");
upgrades_title.className = "upgrades_title";
upgrades_title.textContent = "Upgrades:";
upgrades_shelf.append(upgrades_title);

["Barracks", "Pilot", "General"].forEach((name) => {
  const item = document.createElement("div");
  item.className = "upgrade_item";
  item.textContent = name;
  upgrades_shelf.append(item);
});

const planet_container = document.createElement("div");
planet_container.className = "planets_column";

const planets_title = document.createElement("h4");
planets_title.className = "planets_title";
planets_title.textContent = "Planets:";
planet_container.append(planets_title);

const planet_images: HTMLImageElement[] = [];

// adding planets to the container
for (let i = 0; i < planets.length; i++) {
  const planet = document.createElement("img");

  planet.className = "planet";
  planet.src = planets[i].image;
  planet.alt = planets[i].name;

  planet.addEventListener("click", () => {
    if (soldiers < planets[i].cost) {
      console.log(`Not enough soldiers`);
      return;
    }
    current_planet = i;
    console.log(`Current selected planet is: ${planets[i].name}`);
  });

  planet_images.push(planet);
  planet_container.append(planet);
}

update_planet_display(planets, planet_images, soldiers);

setInterval(() => {
  soldiers = planet_auto_click(planets, soldiers);

  soldier_count.textContent = `Soldiers: ${soldiers}`;

  update_planet_display(planets, planet_images, soldiers);
}, 2000);

setInterval(() => {
  planet_auto_loss(planets);
}, 5000);

setInterval;

game.append(camp_section, upgrades_shelf, planet_container, action_buttons);

app.append(game);
