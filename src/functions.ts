export interface Planet {
  name: string;
  cost: number;
  image: string;
  conquered: boolean;
  display: boolean;
  auto_soldier: number;
  auto_soldier_loss: number;
  conquer_count: number,
  soldier_transport_count: number,
}

function reset_planet(planet: Planet) {
  planet.conquered = false;
  planet.soldier_count = 0;

  planet.cost *= (planet.conquer_count + 1);
}

export function update_planet_display(
  planets: Planet[],
  planet_images: HTMLImageElement[],
  soldiers: number,
) {
  for (let i = 0; i < planets.length; i++) {
    const planet = planets[i];
    const planet_image = planet_images[i];

    if (planet.conquered) {
      // show already conquered planet
      planet_image.style.display = "block";
      planet_image.style.filter = "none";
    } else if (soldiers < planet.cost * 0.5) {
      // hide planet
      planet_image.style.display = "none";
    } else if (soldiers < planet.cost) {
      // show planet but grayed/locked
      planet_image.style.display = "block";
      planet_image.style.filter = "grayscale(100%)";
    } else {
      // show planet
      planet_image.style.display = "block";
      planet_image.style.filter = "none";
    }
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

export function planet_auto_loss(
  planets: Planet[],
) {
  for (let i = 0; i < planets.length; i++) {
    const current_planet = planets[i];

    if (!current_planet.conquered) continue;
    
    current_planet.soldier_count -= current_planet.auto_soldier_loss;

    if (current_planet.soldier_count <= (current_planet.cost / 2)) {
      console.log(`Lost the planet ${current_planet.name}`)
      reset_planet(current_planet);
      continue;
    }

    console.log( `${current_planet.name} soldier count: ${current_planet.soldier_count}`);
  }
}

export function soldier_transport(
  planet: Planet,
  soldiers: number): number {

    if (soldiers < planet.soldier_transport_count) return soldiers;

    soldiers -= planet.soldier_transport_count;

    planet.soldier_count += planet.soldier_transport_count;

    return soldiers;
}