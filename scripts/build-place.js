#!/usr/bin/env node

/**
 * Script to build a place's .rbxlx file using Rojo
 * Usage: node scripts/build-place.js <place-name>
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const placeName = process.argv[2];

if (!placeName) {
  console.error(
    "❌ Please provide a place name: npm run build-place <place-name>"
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

const placeDir = path.join(__dirname, "..", "src", "places", placeName);
const projectFile = path.join(placeDir, `${placeName}.project.json`);
const outputFile = path.join(placeDir, `${placeName}.rbxlx`);

// Check if place exists
if (!fs.existsSync(placeDir)) {
  console.error(`❌ Place "${placeName}" not found!`);
  console.error(`   Expected directory: src/places/${placeName}`);
  process.exit(1);
}

// Check if project file exists
if (!fs.existsSync(projectFile)) {
  console.error(`❌ Project file not found: ${projectFile}`);
  process.exit(1);
}

console.log(`🔨 Building ${placeName}...`);

try {
  // Build the rbxlx file
  execSync(`rojo build "${projectFile}" -o "${outputFile}"`, {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });

  console.log(
    `\n✅ Built successfully: src/places/${placeName}/${placeName}.rbxlx`
  );
} catch (error) {
  console.error(`\n❌ Build failed!`);
  process.exit(1);
}
