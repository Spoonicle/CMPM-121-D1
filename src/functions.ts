export interface Planet {
  name: string,
  cost: number,
  image: string,
  soldier_count: number,
  conquered: boolean,
  display: boolean,
}

export function update_planet_display(
  planets: Planet[],
  planet_images: HTMLImageElement[],
  soldiers: number
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