// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

// -------------------------
// 1. ASSET & MODULE IMPORTS

import Terran from "./assets/Terran.png";
import Ice from "./assets/Ice.png";
import Lava from "./assets/Lava.png";
import Baren from "./assets/Baren.png";
import Black_hole from "./assets/Black_hole.png";
import BlackSoldier from "./assets/Black_Soldier.png";

import {
  barracks,
  barracks_auto_recruit,
  create_soldier_sprite,
  general,
  pilot,
  pilot_auto_transport,
  planet_auto_click,
  planet_auto_loss,
  render_camp,
  soldier_transport,
  update_planet_display,
} from "./functions.ts";
import type { Planet } from "./functions.ts";

// -----------------------------
// 2. GAME STATE & CONFIGURATION

// Core resources & selection state
let soldiers = 0;
let current_planet: number | null = null;

// Upgrade stats: Barracks (auto-recruits soldiers)
let barracks_bought = 0;
let barracks_cost = 50;
let recruiting_soldier_count = 0;

// Upgrade stats: Pilot (auto-transports soldiers to reinforce planets)
let pilots_bought = 0;
let transporting_soldier_count = 0;
let pilot_cost = 150;

// Upgrade stats: General (auto-conquers planets when affordable)
const general_cost = 500;
let can_auto_conquer = false;

// Planet definitions and properties
const planets: Planet[] = [
  {
    name: "Terran",
    cost: 50,
    image: Terran,
    soldier_count: 0,
    conquered: false,
    display: false,
    auto_soldier: 2,
    auto_soldier_loss: 1,
    conquer_count: 0,
    soldier_transport_count: 10,
  },
  {
    name: "Lava",
    cost: 150,
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
    cost: 300,
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
    cost: 500,
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
    cost: 1000,
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

// Upgrade list & UI element references
const upgrades = ["Barracks", "Pilot", "General"];
const upgrade_items: HTMLDivElement[] = [];

// Planet UI element references for dynamic updates
const planet_images: HTMLImageElement[] = [];
const planet_labels: HTMLSpanElement[] = [];

// ---------------------
// 3. DOM ELEMENTS SETUP

// Main game container
const app = document.querySelector<HTMLElement>("#app")!;
const game = document.createElement("div");
game.className = "game";

// Soldier camp section
const camp_section = document.createElement("div");
camp_section.className = "camp_section";

const soldier_count = document.createElement("h2");
soldier_count.className = "soldier_count";
soldier_count.textContent = "Soldiers:";

const soldier_camp = document.createElement("div");
soldier_camp.className = "soldier_camp";

// Upgrades shelf section
const upgrades_shelf = document.createElement("div");
upgrades_shelf.className = "upgrades_shelf";

const upgrades_title = document.createElement("h3");
upgrades_title.className = "upgrades_title";
upgrades_title.textContent = "Upgrades:";
upgrades_shelf.append(upgrades_title);

// Planets column section
const planet_container = document.createElement("div");
planet_container.className = "planets_column";

const planets_title = document.createElement("h4");
planets_title.className = "planets_title";
planets_title.textContent = "Planets:";
planet_container.append(planets_title);

// Action buttons section
const action_buttons = document.createElement("div");
action_buttons.className = "action_buttons";

const transport_button = document.createElement("button");
transport_button.className = "action_btn transport_button";
transport_button.textContent = "Transport";

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

// --------------------------------
// 4. UI HELPER & DISPLAY FUNCTIONS

// Refresh planet visibility, grayscale filters, and cost labels
function refresh_planet_display() {
  update_planet_display(planets, planet_images, soldiers, planet_labels);
}

// Re-render soldier sprites in camp (shows either global soldiers or selected planet soldiers)
function render_current_camp() {
  if (current_planet !== null) {
    render_camp(
      planets[current_planet].soldier_count,
      BlackSoldier,
      soldier_camp,
    );
  } else {
    render_camp(soldiers, BlackSoldier, soldier_camp);
  }
}

// Update the soldier counter header text
function update_soldier_display() {
  if (current_planet !== null) {
    const p = planets[current_planet];
    soldier_count.textContent = `${p.name} soldier count: ${p.soldier_count}`;
  } else {
    soldier_count.textContent = `Soldiers: ${soldiers}`;
  }
}

// Update text labels for upgrade buttons (cost and level/owned status)
function update_upgrade_labels() {
  if (upgrade_items.length >= 3) {
    upgrade_items[0].textContent =
      `Barracks (Cost: ${barracks_cost} | Lv: ${barracks_bought})`;
    upgrade_items[1].textContent =
      `Pilot (Cost: ${pilot_cost} | Lv: ${pilots_bought})`;
    upgrade_items[2].textContent = `General (${
      can_auto_conquer ? "Owned" : `Cost: ${general_cost}`
    })`;
  }
}

// -----------------------
// 5. GAME ACTIONS & LOGIC

// Conquer a specific planet by spending soldiers and claiming it
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
  refresh_planet_display();
  render_current_camp();

  console.log(`${selected_planet.name} has been conquered`);
}

// Upgrade purchase actions mapped by index (0: Barracks, 1: Pilot, 2: General)
const upgrade_actions = [
  // 0: Barracks
  (): boolean => {
    if (soldiers < barracks_cost) return false;
    ({ soldiers, barracks_bought, barracks_cost, recruiting_soldier_count } =
      barracks(
        soldiers,
        barracks_bought,
        barracks_cost,
        recruiting_soldier_count,
      ));
    return true;
  },
  // 1: Pilot
  (): boolean => {
    if (soldiers < pilot_cost) return false;
    ({ soldiers, pilots_bought, pilot_cost, transporting_soldier_count } =
      pilot(soldiers, pilots_bought, pilot_cost, transporting_soldier_count));
    return true;
  },
  // 2: General
  (): boolean => {
    if (
      !can_auto_conquer && general(soldiers, general_cost, can_auto_conquer)
    ) {
      soldiers -= general_cost;
      can_auto_conquer = true;
      return true;
    }
    return false;
  },
];

// ------------------------------------------
// 6. DYNAMIC UI GENERATION & EVENT LISTENERS

// Populate upgrades shelf and attach click events
upgrades.forEach((name, i) => {
  const upgrade = document.createElement("div");

  upgrade.className = "upgrade_item";
  upgrade.textContent = name;

  upgrade.addEventListener("click", () => {
    const upgraded = upgrade_actions[i]();

    if (upgraded) {
      console.log(`Successfully upgraded: ${name}`);
    } else {
      console.log(`Cannot afford upgrade: ${name}`);
    }

    update_upgrade_labels();
    update_soldier_display();
    refresh_planet_display();
    render_current_camp();
  });

  upgrade_items.push(upgrade);
  upgrades_shelf.append(upgrade);
});

// Populate planet column and attach selection click events
for (let i = 0; i < planets.length; i++) {
  const wrapper = document.createElement("div");
  wrapper.className = "planet_wrapper";

  const planet = document.createElement("img");
  planet.className = "planet";
  planet.src = planets[i].image;
  planet.alt = planets[i].name;

  const cost_label = document.createElement("span");
  cost_label.className = "planet_cost";

  planet.addEventListener("click", () => {
    if (!planets[i].conquered) return;

    // Toggle deselection if already selected
    if (current_planet === i) {
      current_planet = null;
      for (const img of planet_images) {
        img.classList.remove("selected_planet");
      }
      render_current_camp();
      update_soldier_display();
      return;
    }

    // Select this planet
    current_planet = i;

    for (const img of planet_images) {
      img.classList.remove("selected_planet");
    }

    planet.classList.add("selected_planet");

    render_current_camp();
    update_soldier_display();

    console.log(`Current selected planet is: ${planets[i].name}`);
  });

  wrapper.append(planet, cost_label);
  planet_images.push(planet);
  planet_labels.push(cost_label);
  planet_container.append(wrapper);
}

// Enlist Button: Manually recruit 1 soldier
enlist_button.addEventListener("click", () => {
  soldiers++;
  update_soldier_display();
  refresh_planet_display();

  if (current_planet === null) {
    soldier_camp.append(create_soldier_sprite(BlackSoldier));
  }
});

// Transport Button: Move soldiers to the selected conquered planet
transport_button.addEventListener("click", () => {
  if (current_planet === null) return;
  const selected_planet = planets[current_planet];

  if (!selected_planet.conquered) return;

  soldiers = soldier_transport(selected_planet, soldiers);
  update_soldier_display();

  refresh_planet_display();

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

// Conquer Button: Conquer the next affordable unconquered planet
conquer_button.addEventListener("click", () => {
  const target = planets.findIndex(
    (p) => !p.conquered && soldiers >= p.cost,
  );
  if (target !== -1) {
    current_planet = target;
    planet_images.forEach((img, idx) => {
      img.classList.toggle("selected_planet", idx === target);
    });
    conquer_planet(target);
  } else {
    const firstUnconquered = planets.findIndex((p) => !p.conquered);
    if (firstUnconquered !== -1) {
      console.log(
        `Not enough troops to conquer planet: ${
          planets[firstUnconquered].name
        }`,
      );
    } else {
      console.log("All planets have already been conquered");
    }
  }
});

// ----------------------
// 7. GAME LOOPS & TIMERS

// 1-second interval: Passive soldiers, barracks recruitment, pilot auto-transport
setInterval(() => {
  soldiers = planet_auto_click(planets, soldiers);

  soldiers = barracks_auto_recruit(barracks_bought, soldiers);

  soldiers = pilot_auto_transport(
    planets,
    soldiers,
    transporting_soldier_count,
  );

  update_soldier_display();
  refresh_planet_display();
}, 1000);

// 2-second interval: General auto-conquer
setInterval(() => {
  if (can_auto_conquer) {
    for (let i = 0; i < planets.length; i++) {
      if (!planets[i].conquered && soldiers >= planets[i].cost) {
        conquer_planet(i);
      }
    }
  }

  update_soldier_display();
  refresh_planet_display();
  render_current_camp();
}, 2000);

// 5-second interval: Planet soldier loss
setInterval(() => {
  planet_auto_loss(planets);
  if (current_planet !== null && !planets[current_planet].conquered) {
    current_planet = null;
    for (const img of planet_images) {
      img.classList.remove("selected_planet");
    }
  }
  render_current_camp();
  update_soldier_display();
  refresh_planet_display();
}, 5000);

// ---------------------------------
// 8. PAGE ASSEMBLY & INITIAL RENDER

// Assemble sub-sections
camp_section.append(soldier_camp, soldier_count);
action_buttons.append(transport_button, enlist_button, conquer_button);

// Assemble and mount the main game container
game.append(camp_section, upgrades_shelf, planet_container, action_buttons);
app.append(game);

// Initial UI renders
update_soldier_display();
update_upgrade_labels();
refresh_planet_display();
