# D1 starter

A minimal TypeScript/Vite browser project with Deno checks and GitHub Pages deployment.

## Github Pages Link

https://spoonicle.github.io/CMPM-121-D1/

## How to Play

Click Enlist to gather soldiers. Use your soldiers to purchase Barracks, Pilots, or a General, as well as conquer planets across the galaxy. Once your soldiers are on a planet, click transport to continue supplying them reinforcements while they battle on the frontlines (lose soldiers over time).

## Run / Build Instructions

Deno Task Dev
Deno Task CI
Deno Task Build

## Structure

Planet lives in functions.ts, which defines all of their values
Planets array lives in Main.ts, where the actual data for the planets currently exist.
Shared logics are handled in the functions.ts script, such as planet_auto_click, planet_auto_loss, and update_planet_display... etc

## Revisions

Commit cdebd44(https://github.com/Spoonicle/CMPM-121-D1/commit/cdebd44071714f9a15907d0e90cc804562066d05) Ivan moved our logic and model from our main.ts to functions.ts file to simplify our code architecture.

Commit 7161f56 (https://github.com/Spoonicle/CMPM-121-D1/commit/7161f5615b708573ce2fed3748af7c9bd4ac8f63) Refactored our code from if/else statements to an upgrade_actions[i]() array, as well as replaced the old
hard coded timer with pilot_auto_transport and barracks_auto_recruit.

## Credits

Background.png - https://enjl.itch.io/background-starry-space/download/eyJpZCI6ODY3ODg5LCJleHBpcmVzIjoxNzkyMDExMDk1fQ%3D%3D.%2FiU2wWa2R%2FCE2YIVnOApfEy%2Fhro%3D

Planet pngs - https://helianthus-games.itch.io/pixel-art-planets

Black_Soldier.png - https://tiago-melo.itch.io/httpstiago-meloitchiofree-assets-soldier-version-two

Tooling adapted from the [CMPM 121 Fall 2026 S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da), which has no explicit repository license. No new license is assigned to that material. The D1 scaffold and original SVG were authored with OpenAI GPT-6 Astra assistance. Dependencies retain their respective licenses.
