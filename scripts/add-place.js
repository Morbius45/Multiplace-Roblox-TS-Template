#!/usr/bin/env node

/**
 * Script to quickly scaffold a new place in the multiplace framework
 * Usage: node scripts/add-place.js <place-name>
 */

const fs = require("fs");
const path = require("path");

const placeName = process.argv[2];

if (!placeName) {
  console.error(
    "❌ Please provide a place name: node scripts/add-place.js <place-name>"
  );
  process.exit(1);
}

// Validate place name (lowercase, alphanumeric, hyphens only)
if (!/^[a-z0-9-]+$/.test(placeName)) {
  console.error(
    "❌ Place name must be lowercase, alphanumeric, and can contain hyphens"
  );
  process.exit(1);
}

const placeDir = path.join(__dirname, "..", "src", "places", placeName);
const placeTitleCase = placeName
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join("");

// Check if place already exists
if (fs.existsSync(placeDir)) {
  console.error(`❌ Place "${placeName}" already exists!`);
  process.exit(1);
}

console.log(`🎮 Creating new place: ${placeName}`);

// Create directory structure
const dirs = [
  placeDir,
  path.join(placeDir, "src"),
  path.join(placeDir, "src", "client"),
  path.join(placeDir, "src", "client", "controllers"),
  path.join(placeDir, "src", "client", "components"),
  path.join(placeDir, "src", "server"),
  path.join(placeDir, "src", "server", "services"),
  path.join(placeDir, "src", "server", "components"),
  path.join(placeDir, "src", "shared"),
];

dirs.forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
});
console.log(`  ✓ Created directory structure`);

// Create client runtime (Flamework)
const clientRuntime = `// Place-specific client runtime for ${placeTitleCase} place
import { Flamework } from "@flamework/core";
import { initializeGameClient, igniteClient } from "game/client/bootstrap";

// Initialize shared game systems (adds game paths)
initializeGameClient();

// Add place-specific paths
Flamework.addPaths("out/places/${placeName}/src/client/controllers");
Flamework.addPaths("out/places/${placeName}/src/client/components");

// Ignite Flamework (starts all controllers)
igniteClient();

// Place-specific initialization
print("[Client] ${placeTitleCase} place initialized");
`;

fs.writeFileSync(
  path.join(placeDir, "src", "client", "runtime.client.ts"),
  clientRuntime
);
console.log(`  ✓ Created client runtime`);

// Create server runtime (Flamework)
const serverRuntime = `// Place-specific server runtime for ${placeTitleCase} place
import { Flamework } from "@flamework/core";
import { initializeGameServer, igniteServer } from "game/server/bootstrap";

// Initialize shared game systems (adds game paths)
initializeGameServer();

// Add place-specific paths
Flamework.addPaths("out/places/${placeName}/src/server/services");
Flamework.addPaths("out/places/${placeName}/src/server/components");

// Ignite Flamework (starts all services)
igniteServer();

// Place-specific initialization
print("[Server] ${placeTitleCase} place initialized");
`;

fs.writeFileSync(
  path.join(placeDir, "src", "server", "runtime.server.ts"),
  serverRuntime
);
console.log(`  ✓ Created server runtime`);

// Create shared index
const sharedIndex = `// Place-specific shared code for ${placeTitleCase} place
// Add any place-specific constants, types, or utilities here

export const PLACE_NAME = "${placeTitleCase}";
export const PLACE_ID = "${placeName}";
`;

fs.writeFileSync(path.join(placeDir, "src", "shared", "index.ts"), sharedIndex);
console.log(`  ✓ Created shared index`);

// Create client controllers index
const clientControllersIndex = `// Place-specific client controllers for ${placeTitleCase} place
// Flamework auto-discovers @Controller() decorated classes
// No manual imports needed - just add new @Controller() files to this folder
`;
fs.writeFileSync(
  path.join(placeDir, "src", "client", "controllers", "index.ts"),
  clientControllersIndex
);

// Create client components index
const clientComponentsIndex = `// Place-specific client components for ${placeTitleCase} place
// Flamework auto-discovers @Component() decorated classes
// No manual imports needed - just add new @Component() files to this folder
`;
fs.writeFileSync(
  path.join(placeDir, "src", "client", "components", "index.ts"),
  clientComponentsIndex
);

// Create server services index
const serverServicesIndex = `// Place-specific server services for ${placeTitleCase} place
// Flamework auto-discovers @Service() decorated classes
// No manual imports needed - just add new @Service() files to this folder
`;
fs.writeFileSync(
  path.join(placeDir, "src", "server", "services", "index.ts"),
  serverServicesIndex
);

// Create server components index
const serverComponentsIndex = `// Place-specific server components for ${placeTitleCase} place
// Flamework auto-discovers @Component() decorated classes
// No manual imports needed - just add new @Component() files to this folder
`;
fs.writeFileSync(
  path.join(placeDir, "src", "server", "components", "index.ts"),
  serverComponentsIndex
);
console.log(`  ✓ Created controllers, components, and services`);

// Create example service
const exampleService = `import { Service, OnStart } from "@flamework/core";

@Service()
export class Example${placeTitleCase}Service implements OnStart {
\tonStart() {
\t\tprint("[Example${placeTitleCase}Service] Started");
\t}
}
`;
fs.writeFileSync(
  path.join(
    placeDir,
    "src",
    "server",
    "services",
    `Example${placeTitleCase}Service.ts`
  ),
  exampleService
);
console.log(`  ✓ Created example service`);

// Create Rojo project file (uses TS for place-specific code)
const rojoProject = {
  name: `${placeName}-place`,
  tree: {
    $className: "DataModel",
    ReplicatedStorage: {
      $className: "ReplicatedStorage",
      Game: {
        $path: "../../../out/game/shared",
      },
      TS: {
        $path: `../../../out/places/${placeName}/src/shared`,
      },
      Assets: {
        $path: "../../../assets",
      },
      rbxts_include: {
        $path: "../../../include",
        node_modules: {
          $className: "Folder",
          "@rbxts": {
            $path: "../../../node_modules/@rbxts",
          },
          "@rbxts-js": {
            $path: "../../../node_modules/@rbxts-js",
          },
          "@flamework": {
            $path: "../../../node_modules/@flamework",
          },
        },
      },
    },
    ServerScriptService: {
      $className: "ServerScriptService",
      Game: {
        $path: "../../../out/game/server",
      },
      TS: {
        $path: `../../../out/places/${placeName}/src/server`,
      },
    },
    StarterPlayer: {
      $className: "StarterPlayer",
      StarterPlayerScripts: {
        $className: "StarterPlayerScripts",
        Game: {
          $path: "../../../out/game/client",
        },
        TS: {
          $path: `../../../out/places/${placeName}/src/client`,
        },
      },
    },
    Workspace: {
      $className: "Workspace",
      $properties: {
        FilteringEnabled: true,
      },
    },
    SoundService: {
      $className: "SoundService",
      $properties: {
        RespectFilteringEnabled: true,
      },
    },
  },
};

fs.writeFileSync(
  path.join(placeDir, `${placeName}.project.json`),
  JSON.stringify(rojoProject, null, 2)
);
console.log(`  ✓ Created Rojo project file`);

// Update build.project.json to include the new place
const buildProjectPath = path.join(__dirname, "..", "build.project.json");
if (fs.existsSync(buildProjectPath)) {
  const buildProject = JSON.parse(fs.readFileSync(buildProjectPath, "utf8"));

  // Add to ReplicatedStorage/Places
  if (!buildProject.tree.ReplicatedStorage.Places) {
    buildProject.tree.ReplicatedStorage.Places = { $className: "Folder" };
  }
  buildProject.tree.ReplicatedStorage.Places[placeName] = {
    $path: `out/places/${placeName}/src/shared`,
  };

  // Add to ServerScriptService/Places
  if (!buildProject.tree.ServerScriptService.Places) {
    buildProject.tree.ServerScriptService.Places = { $className: "Folder" };
  }
  buildProject.tree.ServerScriptService.Places[placeName] = {
    $path: `out/places/${placeName}/src/server`,
  };

  // Add to StarterPlayer/StarterPlayerScripts/Places
  if (!buildProject.tree.StarterPlayer.StarterPlayerScripts.Places) {
    buildProject.tree.StarterPlayer.StarterPlayerScripts.Places = {
      $className: "Folder",
    };
  }
  buildProject.tree.StarterPlayer.StarterPlayerScripts.Places[placeName] = {
    $path: `out/places/${placeName}/src/client`,
  };

  fs.writeFileSync(buildProjectPath, JSON.stringify(buildProject, null, 2));
  console.log(`  ✓ Updated build.project.json`);
}

// Create per-place build project file (uses TS paths for development)
const buildPlaceProject = {
  name: `build-${placeName}`,
  tree: {
    $className: "DataModel",
    ReplicatedStorage: {
      $className: "ReplicatedStorage",
      Game: {
        $path: "out/game/shared",
      },
      TS: {
        $path: `out/places/${placeName}/src/shared`,
      },
      Assets: {
        $path: "assets",
      },
      rbxts_include: {
        $path: "include",
        node_modules: {
          $className: "Folder",
          "@rbxts": {
            $path: "node_modules/@rbxts",
          },
          "@rbxts-js": {
            $path: "node_modules/@rbxts-js",
          },
          "@flamework": {
            $path: "node_modules/@flamework",
          },
        },
      },
    },
    ServerScriptService: {
      $className: "ServerScriptService",
      Game: {
        $path: "out/game/server",
      },
      TS: {
        $path: `out/places/${placeName}/src/server`,
      },
    },
    StarterPlayer: {
      $className: "StarterPlayer",
      StarterPlayerScripts: {
        $className: "StarterPlayerScripts",
        Game: {
          $path: "out/game/client",
        },
        TS: {
          $path: `out/places/${placeName}/src/client`,
        },
      },
    },
    Workspace: {
      $className: "Workspace",
      $properties: {
        FilteringEnabled: true,
      },
    },
    SoundService: {
      $className: "SoundService",
      $properties: {
        RespectFilteringEnabled: true,
      },
    },
  },
};

fs.writeFileSync(
  path.join(__dirname, "..", `build-${placeName}.project.json`),
  JSON.stringify(buildPlaceProject, null, 2)
);
console.log(`  ✓ Created build-${placeName}.project.json`);

// Create per-place tsconfig
const tsconfigPlace = {
  extends: "./tsconfig.json",
  include: ["src/game/**/*", `src/places/${placeName}/**/*`],
};

fs.writeFileSync(
  path.join(__dirname, "..", `tsconfig.${placeName}.json`),
  JSON.stringify(tsconfigPlace, null, 2)
);
console.log(`  ✓ Created tsconfig.${placeName}.json`);

// Update package.json with new scripts
const packageJsonPath = path.join(__dirname, "..", "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  packageJson.scripts[`build:${placeName}`] =
    `rbxtsc -p tsconfig.${placeName}.json --rojo build-${placeName}.project.json`;
  packageJson.scripts[`watch:${placeName}`] =
    `rbxtsc -w -p tsconfig.${placeName}.json --rojo build-${placeName}.project.json`;
  packageJson.scripts[`serve:${placeName}`] =
    `rojo serve src/places/${placeName}/${placeName}.project.json`;
  packageJson.scripts[`dev:${placeName}`] =
    `concurrently "npm run watch:${placeName}" "npm run serve:${placeName}"`;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`  ✓ Updated package.json with scripts`);
}

console.log(`\n✅ Place "${placeName}" created successfully!`);
console.log(`\n📝 Next steps:`);
console.log(`  1. Create a new Roblox place in Studio`);
console.log(`  2. Save it as: src/places/${placeName}/${placeName}.rbxlx`);
console.log(`  3. Add to mantle.yml:`);
console.log(`     places:`);
console.log(`       ${placeName}:`);
console.log(
  `         assetId: \${{ secrets.${placeName.toUpperCase().replace(/-/g, "_")}_PLACE_ID }}`
);
console.log(`         file: src/places/${placeName}/${placeName}.rbxlx`);
console.log(`\n🚀 Start developing: npm run dev:${placeName}`);
