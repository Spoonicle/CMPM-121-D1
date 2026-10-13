export interface Planet {
  name: string;
  cost: number;
  image: string;
  soldier_count: number;
  conquered: boolean;
  display: boolean;
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

export function create_soldier_sprite(spriteUrl: string): HTMLDivElement {
  const soldier_sprite = document.createElement("div");
  soldier_sprite.className = "soldier_sprite";
  soldier_sprite.style.backgroundImage = `url(${spriteUrl})`;
  soldier_sprite.style.backgroundPositionX = `0px`;
  soldier_sprite.style.backgroundPositionY = `${-(14 * 67)}px`;

  let spriteFrame = 0;
  const spriteFrameCount = 5;
  const spriteStartRow = 14;

  setInterval(() => {
    spriteFrame = (spriteFrame + 1) % spriteFrameCount;
    const col = spriteFrame % 3;
    const row = spriteStartRow + Math.floor(spriteFrame / 3);
    soldier_sprite.style.backgroundPositionX = `${-(col * 116)}px`;
    soldier_sprite.style.backgroundPositionY = `${-(row * 67)}px`;
  }, 150);

  return soldier_sprite;
}
