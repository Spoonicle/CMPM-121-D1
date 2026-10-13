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
  barracks,
  create_soldier_sprite,
  general,
  pilot,
  planet_auto_click,
  planet_auto_loss,
  render_camp,
  soldier_transport,
  update_planet_display,
} from "./functions.ts";
import type { Planet } from "./functions.ts";

const app = document.querySelector<HTMLElement>("#app")!;

const game = document.createElement("div");
game.className = "game";

let soldiers = 0;

let barracks_bought = 0;
let barracks_cost = 125;
let recruiting_soldier_count = 1;

let pilots_bought = 0;
let transporting_soldier_count = 0;
let pilot_cost = 175;

const general_cost = 10000;
let can_auto_conquer = false;

// set array of planets
const planets: Planet[] = [
  {
    name: "Terran",
    cost: 10,
    image: Terran,
    soldier_count: 0,
    conquered: false,
    display: false,
    auto_soldier: 1,
    auto_soldier_loss: 2,
    conquer_count: 0,
    soldier_transport_count: 10,
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
    conquer_count: 0,
    soldier_transport_count: 10,
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
    conquer_count: 0,
    soldier_transport_count: 10,
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
    conquer_count: 0,
    soldier_transport_count: 10,
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
    conquer_count: 0,
    soldier_transport_count: 10,
  },
];

const upgrades = ["Barracks", "Pilot", "General"];
const upgrade_items: HTMLDivElement[] = [];

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

let current_planet: number | null = null;

let current_upgrade: number | null = null;

function render_current_camp() {
  if (current_planet !== null && planets[current_planet].conquered) {
    render_camp(
      planets[current_planet].soldier_count,
      BlackSoldier,
      soldier_camp,
    );
  } else {
    render_camp(soldiers, BlackSoldier, soldier_camp);
  }
}

transport_button.addEventListener("click", () => {
  if (current_planet === null) return;
  const selected_planet = planets[current_planet];

  if (!selected_planet.conquered) return;

  soldiers = soldier_transport(selected_planet, soldiers);
  update_soldier_display();

  update_planet_display(planets, planet_images, soldiers);

  render_camp(
    planets[current_planet].soldier_count,
    BlackSoldier,
    soldier_camp,
  );

  console.log("Transport clicked");
  console.log(
    `${selected_planet.name} has ${selected_planet.soldier_count} soldiers`,
  );
});

const enlist_button = document.createElement("button");
enlist_button.className = "action_btn enlist_button";
enlist_button.textContent = "Enlist";

const conquer_button = document.createElement("button");
conquer_button.className = "action_btn conquer_button";
conquer_button.textContent = "Conquer";

const barracks_button = document.createElement("button");
barracks_button.className = "action_btn barracks_button";
barracks_button.textContent = "Barracks";

const pilot_button = document.createElement("button");
pilot_button.className = "action_btn pilot_button";
pilot_button.textContent = "Pilot";

const general_button = document.createElement("button");
general_button.className = "action_btn general_button";
general_button.textContent = "General";

// add soldier and update text
enlist_button.addEventListener("click", () => {
  soldiers++;
  update_soldier_display();
  update_planet_display(planets, planet_images, soldiers);

  if (current_planet === null) {
    soldier_camp.append(create_soldier_sprite(BlackSoldier));
  }
});

function update_soldier_display() {
  if (current_planet !== null && planets[current_planet].conquered) {
    const p = planets[current_planet];
    soldier_count.textContent = `${p.name} soldier count: ${p.soldier_count}`;
  } else {
    soldier_count.textContent = `Soldiers: ${soldiers}`;
  }
}

function conquer_planet(planet_index: number) {
  const selected_planet = planets[planet_index];

  if (selected_planet.conquered) {
    console.log(`${selected_planet.name} has already been conquered`);
    return;
  }
  if (soldiers < selected_planet.cost) {
    console.log(
      `Not enough troops to conquer planet: ${selected_planet.name} `,
    );
    return;
  }

  soldiers -= selected_planet.cost;
  selected_planet.soldier_count += selected_planet.cost;
  selected_planet.conquered = true;
  selected_planet.conquer_count++;

  update_soldier_display();
  update_planet_display(planets, planet_images, soldiers);
  render_current_camp();

  console.log(`${selected_planet.name} has been conquered`);
}

action_buttons.append(transport_button, enlist_button, conquer_button);

camp_section.append(soldier_camp, soldier_count);

const upgrades_shelf = document.createElement("div");
upgrades_shelf.className = "upgrades_shelf";

const upgrades_title = document.createElement("h3");
upgrades_title.className = "upgrades_title";
upgrades_title.textContent = "Upgrades:";
upgrades_shelf.append(upgrades_title);

function update_upgrade_labels() {
  if (upgrade_items.length >= 3) {
    upgrade_items[0].textContent =
      `Barracks (Cost: ${barracks_cost} | Lv: ${barracks_bought})`;
    upgrade_items[1].textContent =
      `Pilot (Cost: ${pilot_cost} | Lv1: ${pilots_bought})`;
    upgrade_items[2].textContent = `General (${
      can_auto_conquer ? "Owned" : `Cost: ${general_cost}`
    })`;
  }
}

const upgrade_actions = [
  //0: Barracks
  () => {
    ({ soldiers, barracks_bought, barracks_cost, recruiting_soldier_count } =
      barracks(
        soldiers,
        barracks_bought,
        barracks_cost,
        recruiting_soldier_count,
      ));
  },
  //1: Pilot
  () => {
    ({ soldiers, pilots_bought, pilot_cost, transporting_soldier_count } =
      pilot(soldiers, pilots_bought, pilot_cost, transporting_soldier_count));
  },
  //2, General
  () => {
    if (!can_auto_conquer && soldiers >= general_cost) {
      //soldiers -= general_cost;
      can_auto_conquer = general(
        soldiers + general_cost,
        general_cost,
        can_auto_conquer,
      );
    }
  },
];

upgrades.forEach((name, i) => {
  const upgrade = document.createElement("div");

  upgrade.className = "upgrade_item";
  upgrade.textContent = name;

  upgrade.addEventListener("click", () => {
    current_upgrade = i;

    for (const upgrade_item of upgrade_items) {
      upgrade_item.classList.remove("selected");
    }

    upgrade.classList.add("selected");

    upgrade_actions[i]();

    update_upgrade_labels();
    update_soldier_display();
    update_planet_display(planets, planet_images, soldiers);
    render_current_camp();

    console.log(`Selected upgrade is: ${upgrades[current_upgrade]}`);
  });

  upgrade_items.push(upgrade);
  upgrades_shelf.append(upgrade);
});

update_upgrade_labels();

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
    current_planet = i;

    for (const img of planet_images) {
      img.classList.remove("selected_planet");
    }

    planet.classList.add("selected_planet");

    render_current_camp();

    if (planets[i].conquered) {
      render_camp(planets[i].soldier_count, BlackSoldier, soldier_camp);
    } else {
      render_camp(soldiers, BlackSoldier, soldier_camp);
    }

    update_soldier_display();

    console.log(`Current selected planet is: ${planets[i].name}`);
  });

  planet_images.push(planet);
  planet_container.append(planet);
}

update_planet_display(planets, planet_images, soldiers);

setInterval(() => {
  soldiers = planet_auto_click(planets, soldiers);

  if (can_auto_conquer) {
    for (let i = 0; i < planets.length; i++) {
      if (!planets[i].conquered && soldiers >= planets[i].cost) {
        conquer_planet(i);
      }
    }
  }

  update_soldier_display();
  update_planet_display(planets, planet_images, soldiers);
  render_current_camp();
}, 2000);

setInterval(() => {
  planet_auto_loss(planets);
  render_current_camp();
  update_soldier_display();
  update_planet_display(planets, planet_images, soldiers);
}, 5000);

game.append(camp_section, upgrades_shelf, planet_container, action_buttons);

app.append(game);
