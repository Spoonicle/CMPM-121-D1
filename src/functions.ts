export interface Planet {
  name: string;
  cost: number;
  image: string;
  soldier_count: number;
  conquered: boolean;
  display: boolean;
  auto_soldier: number;
  auto_soldier_loss: number;
  conquer_count: number;
  soldier_transport_count: number;
}

function reset_planet(planet: Planet) {
  planet.conquered = false;
  planet.soldier_count = 0;

  planet.cost *= planet.conquer_count + 1;
}

export function update_planet_display(
  planets: Planet[],
  planet_images: HTMLImageElement[],
  soldiers: number,
  planet_labels?: HTMLElement[],
) {
  for (let i = 0; i < planets.length; i++) {
    const planet = planets[i];
    const planet_image = planet_images[i];
    const label = planet_labels ? planet_labels[i] : null;

    if (planet.conquered) {
      // show already conquered planet
      planet_image.style.display = "block";
      planet_image.style.filter = "none";
      if (label) label.textContent = "";
    } else if (soldiers < planet.cost * 0.5) {
      // hide planet
      planet_image.style.display = "none";
      if (label) label.textContent = "";
    } else if (soldiers < planet.cost) {
      // show planet but grayed/locked
      planet_image.style.display = "block";
      planet_image.style.filter = "grayscale(100%)";
      if (label) label.textContent = `Cost: ${planet.cost}`;
    } else {
      // show planet
      planet_image.style.display = "block";
      planet_image.style.filter = "none";
      if (label) label.textContent = "";
    }
  }
}

export function render_camp(
  soldier_count: number,
  spriteUrl: string,
  camp: HTMLDivElement,
) {
  camp.innerHTML = "";
  for (let i = 0; i < soldier_count; i++) {
    camp.append(create_soldier_sprite(spriteUrl));
  }
}

export function planet_auto_click(
  planets: Planet[],
  soldiers: number,
): number {
  for (let i = 0; i < planets.length; i++) {
    const current_planet = planets[i];
    if (!current_planet.conquered) continue;
    soldiers += current_planet.auto_soldier;
  }
  return soldiers;
}

export function barracks_auto_recruit(
  barracks_bought: number,
  soldiers: number,
): number {
  return soldiers + barracks_bought;
}

export function pilot_auto_transport(
  planets: Planet[],
  soldiers: number,
  transporting_soldier_count: number,
): number {
  if (transporting_soldier_count <= 0 || soldiers <= 0) return soldiers;

  const planetsNeedingReinforcement = planets
    .filter((p) => p.conquered && p.soldier_count < p.cost)
    .sort((a, b) => a.soldier_count - b.soldier_count);

  if (planetsNeedingReinforcement.length === 0) return soldiers;

  let availableTransfer = transporting_soldier_count;

  for (const planet of planetsNeedingReinforcement) {
    if (availableTransfer <= 0 || soldiers <= 0) break;

    const deficit = planet.cost - planet.soldier_count;
    const toSend = Math.min(deficit, availableTransfer, soldiers);

    if (toSend > 0) {
      soldiers -= toSend;
      planet.soldier_count += toSend;
      availableTransfer -= toSend;
    }
  }

  return soldiers;
}

export function planet_auto_loss(planets: Planet[]) {
  for (let i = 0; i < planets.length; i++) {
    const current_planet = planets[i];
    if (!current_planet.conquered) continue;

    current_planet.soldier_count -= current_planet.auto_soldier_loss;

    if (current_planet.soldier_count <= (current_planet.cost / 2)) {
      console.log(`Lost the planet ${current_planet.name}`);
      reset_planet(current_planet);
      continue;
    }

    console.log(
      `${current_planet.name} soldier count: ${current_planet.soldier_count}`,
    );
  }
}

export function create_soldier_sprite(spriteUrl: string): HTMLDivElement {
  const soldier_sprite = document.createElement("div");
  soldier_sprite.className = "soldier_sprite";
  soldier_sprite.style.backgroundImage = `url(${spriteUrl})`;
  soldier_sprite.style.backgroundPositionX = `0px`;
  soldier_sprite.style.backgroundPositionY = `${-(14 * 67)}px`;

  let spriteFrame = 0;
  const spriteFrameCount = 5;
  const spriteStartRow = 14;

  const timer = setInterval(() => {
    if (!soldier_sprite.isConnected) {
      clearInterval(timer);
      return;
    }
    spriteFrame = (spriteFrame + 1) % spriteFrameCount;
    const col = spriteFrame % 3;
    const row = spriteStartRow + Math.floor(spriteFrame / 3);
    soldier_sprite.style.backgroundPositionX = `${-(col * 116)}px`;
    soldier_sprite.style.backgroundPositionY = `${-(row * 67)}px`;
  }, 150);

  return soldier_sprite;
}

export function soldier_transport(
  planet: Planet,
  soldiers: number,
): number {
  if (soldiers < planet.soldier_transport_count) return soldiers;

  soldiers -= planet.soldier_transport_count;

  planet.soldier_count += planet.soldier_transport_count;

  return soldiers;
}

export function barracks(
  soldiers: number,
  barracks_bought: number,
  barracks_cost: number,
  recruiting_soldier_count: number,
) {
  if (soldiers < barracks_cost) {
    return {
      soldiers,
      barracks_bought,
      barracks_cost,
      recruiting_soldier_count,
    };
  }

  soldiers -= barracks_cost;

  barracks_bought++;

  barracks_cost = Math.ceil(barracks_cost * 1.25);

  recruiting_soldier_count++;

  console.log(
    `Bought a barracks. Barracks count is: ${recruiting_soldier_count}, cost is now: ${barracks_cost}`,
  );

  return {
    soldiers,
    barracks_bought,
    barracks_cost,
    recruiting_soldier_count,
  };
}

export function pilot(
  soldiers: number,
  pilots_bought: number,
  pilot_cost: number,
  transporting_soldier_count: number,
) {
  if (soldiers < pilot_cost) {
    return {
      soldiers,
      pilots_bought,
      pilot_cost,
      transporting_soldier_count,
    };
  }

  soldiers -= pilot_cost;

  pilots_bought++;

  pilot_cost = Math.ceil(pilot_cost * 1.25);

  transporting_soldier_count += 5;

  console.log(
    `Bought a pilot. Pilot count is: ${transporting_soldier_count}, cost is now: ${pilot_cost}`,
  );

  return {
    soldiers,
    pilots_bought,
    pilot_cost,
    transporting_soldier_count,
  };
}

export function general(
  soldiers: number,
  general_cost: number,
  _can_auto_conquer: boolean,
): boolean {
  if (soldiers < general_cost) {
    return false;
  }
  return true;
}
