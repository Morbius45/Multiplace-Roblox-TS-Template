#!/usr/bin/env node

/**
 * Script to completely remove a place from the multiplace framework
 * Usage: node scripts/remove-place.js <place-name>
 */

const fs = require("fs");
const path = require("path");

const placeName = process.argv[2];

if (!placeName) {
  console.error(
    "❌ Please provide a place name: npm run remove-place <place-name>"
  );
  console.error("\nAvailable places:");

  const placesDir = path.join(__dirname, "..", "src", "places");
  if (fs.existsSync(placesDir)) {
    const places = fs
      .readdirSync(placesDir)
      .filter((f) => fs.statSync(path.join(placesDir, f)).isDirectory());
    places.forEach((p) => console.error(`  - ${p}`));
  }
  process.exit(1);
}

// Protect start place
if (placeName === "start") {
  console.error("❌ Cannot remove the 'start' place - it's the main place!");
  process.exit(1);
}

const placeDir = path.join(__dirname, "..", "src", "places", placeName);

// Check if place exists
if (!fs.existsSync(placeDir)) {
  console.error(`❌ Place "${placeName}" not found!`);
  process.exit(1);
}

console.log(`🗑️  Removing place: ${placeName}`);

// 1. Remove place directory
fs.rmSync(placeDir, { recursive: true, force: true });
console.log(`  ✓ Removed src/places/${placeName}/`);

// 2. Remove build project file
const buildProjectFile = path.join(
  __dirname,
  "..",
  `build-${placeName}.project.json`
);
if (fs.existsSync(buildProjectFile)) {
  fs.unlinkSync(buildProjectFile);
  console.log(`  ✓ Removed build-${placeName}.project.json`);
}

// 3. Remove tsconfig file
const tsconfigFile = path.join(__dirname, "..", `tsconfig.${placeName}.json`);
if (fs.existsSync(tsconfigFile)) {
  fs.unlinkSync(tsconfigFile);
  console.log(`  ✓ Removed tsconfig.${placeName}.json`);
}

// 4. Remove from build.project.json
const buildProjectPath = path.join(__dirname, "..", "build.project.json");
if (fs.existsSync(buildProjectPath)) {
  const buildProject = JSON.parse(fs.readFileSync(buildProjectPath, "utf8"));

  // Remove from ReplicatedStorage/Places
  if (buildProject.tree?.ReplicatedStorage?.Places?.[placeName]) {
    delete buildProject.tree.ReplicatedStorage.Places[placeName];
  }

  // Remove from ServerScriptService/Places
  if (buildProject.tree?.ServerScriptService?.Places?.[placeName]) {
    delete buildProject.tree.ServerScriptService.Places[placeName];
  }

  // Remove from StarterPlayer/StarterPlayerScripts/Places
  if (
    buildProject.tree?.StarterPlayer?.StarterPlayerScripts?.Places?.[placeName]
  ) {
    delete buildProject.tree.StarterPlayer.StarterPlayerScripts.Places[
      placeName
    ];
  }

  fs.writeFileSync(buildProjectPath, JSON.stringify(buildProject, null, 2));
  console.log(`  ✓ Updated build.project.json`);
}

// 5. Remove scripts from package.json
const packageJsonPath = path.join(__dirname, "..", "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  const scriptsToRemove = [
    `build:${placeName}`,
    `watch:${placeName}`,
    `serve:${placeName}`,
    `dev:${placeName}`,
  ];

  scriptsToRemove.forEach((script) => {
    if (packageJson.scripts?.[script]) {
      delete packageJson.scripts[script];
    }
  });

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`  ✓ Updated package.json`);
}

// 6. Remove compiled output
const outDir = path.join(__dirname, "..", "out", "places", placeName);
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
  console.log(`  ✓ Removed out/places/${placeName}/`);
}

console.log(`\n✅ Place "${placeName}" removed successfully!`);
console.log(`\n⚠️  Don't forget to:`);
console.log(`  1. Remove the place from mantle.yml if it was added there`);
console.log(`  2. Delete the place from Roblox if it was published`);
