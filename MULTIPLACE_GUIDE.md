# Multiplace Framework Guide

This template is configured as a **multiplace framework**, allowing you to create multiple places (levels/worlds) that share common game logic while having their own place-specific code.

## 📁 Project Structure

```
MyTemplateV2Multiplace/
├── src/                           # All source code
│   ├── game/                      # Shared logic for ALL places
│   │   ├── client/                # Shared client code
│   │   │   ├── bootstrap.ts
│   │   │   ├── runtime.client.ts
│   │   │   ├── components/
│   │   │   ├── controllers/
│   │   │   └── ui/
│   │   ├── server/                # Shared server code
│   │   │   ├── bootstrap.ts
│   │   │   ├── runtime.server.ts
│   │   │   ├── components/
│   │   │   └── services/
│   │   └── shared/                # Shared between client & server
│   │       ├── assets/
│   │       ├── data/
│   │       ├── network/
│   │       ├── store/
│   │       └── types/
│   │
│   └── places/                    # Individual places
│       └── start/                 # Example: Start place
│           ├── start.rbxlx        # Place file
│           ├── start.project.json # Rojo config for this place
│           └── src/               # Place-specific code
│               ├── client/
│               │   └── runtime.client.ts
│               ├── server/
│               │   └── runtime.server.ts
│               └── shared/
│                   └── index.ts
│
├── assets/                        # Shared assets (images, sounds)
├── include/                       # Include files (Promise, RuntimeLib)
├── scripts/                       # Helper scripts
│   ├── add-place.js              # Script to scaffold new places
│   ├── remove-place.js           # Script to remove places
│   └── build-place.js            # Script to build place .rbxlx files
├── default.project.json          # Default Rojo config (points to start)
├── build.project.json            # Build config for roblox-ts
├── mantle.yml                    # Mantle deployment config
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # NPM scripts and dependencies
```

## 🎯 How It Works

### Game Folder (Shared Logic)

The `src/game/` folder contains all the code that is **shared across all places**:

- Common services, controllers, and components
- Shared UI components
- Shared data models and types
- Shared store/state management
- Network definitions

### Places Folder (Place-Specific Logic)

Each place in `places/` has its own:

- `.rbxlx` file (the actual Roblox place)
- `.project.json` file (Rojo configuration)
- `src/` folder with place-specific code

Place-specific code can:

- Import and use shared game logic
- Override or extend shared functionality
- Add place-specific features

## 🚀 Adding a New Place

### Quick Method (Recommended)

Use the included script to scaffold a new place:

```bash
npm run add-place <place-name>
```

For example:

```bash
npm run add-place lobby
npm run add-place arena
npm run add-place battle-royale
```

The script will:

- Create the folder structure in `src/places/<name>/`
- Generate the Rojo project files (place-specific and build)
- Create tsconfig for the place
- Create Flamework-enabled client/server runtime files
- Add npm scripts for the place (build, watch, serve, dev)
- Provide next steps instructions

### Removing a Place

To completely remove a place and all its associated files:

```bash
npm run remove-place <place-name>
```

This will:

- Remove the place folder from `src/places/`
- Delete `build-<name>.project.json`
- Delete `tsconfig.<name>.json`
- Remove entries from `build.project.json`
- Remove npm scripts from `package.json`
- Clean compiled output from `out/places/<name>/`

**Note:** The `start` place cannot be removed as it's the main entry point.

### Building Place Files

To build a `.rbxlx` file for a place:

```bash
npm run build-place <place-name>
```

This compiles TypeScript and runs `rojo build` to create the place file at `out/places/<name>/<name>.rbxlx`.

### Manual Method

1. **Create the place folder structure:**

   ```bash
   mkdir -p places/myplace/src/{client,server,shared}
   ```

2. **Create the place file:**
   - Create a new Roblox place in Studio
   - Save it as `places/myplace/myplace.rbxlx`

3. **Create the Rojo project file** (`places/myplace/myplace.project.json`):

   ```json
   {
     "name": "myplace",
     "tree": {
       "$className": "DataModel",
       "ReplicatedStorage": {
         "$className": "ReplicatedStorage",
         "Game": {
           "$path": "../../out/game/shared"
         },
         "TS": {
           "$path": "../../out/places/myplace/src/shared"
         },
         "Assets": {
           "$path": "../../assets"
         },
         "rbxts_include": {
           "$path": "../../include",
           "node_modules": {
             "$className": "Folder",
             "@rbxts": {
               "$path": "../../node_modules/@rbxts"
             },
             "@rbxts-js": {
               "$path": "../../node_modules/@rbxts-js"
             }
           }
         }
       },
       "ServerScriptService": {
         "$className": "ServerScriptService",
         "Game": {
           "$path": "../../out/game/server"
         },
         "TS": {
           "$path": "../../out/places/myplace/src/server"
         }
       },
       "StarterPlayer": {
         "$className": "StarterPlayer",
         "StarterPlayerScripts": {
           "$className": "StarterPlayerScripts",
           "Game": {
             "$path": "../../out/game/client"
           },
           "TS": {
             "$path": "../../out/places/myplace/src/client"
           }
         }
       },
       "Workspace": {
         "$className": "Workspace",
         "$properties": {
           "FilteringEnabled": true
         }
       },
       "SoundService": {
         "$className": "SoundService",
         "$properties": {
           "RespectFilteringEnabled": true
         }
       }
     }
   }
   ```

4. **Create place runtime files:**

   `places/myplace/src/client/runtime.client.ts`:

   ```typescript
   import { initializeGameClient } from "game/client/bootstrap";

   // Initialize shared game systems
   initializeGameClient();

   print("[Client] MyPlace initialized");

   // Add place-specific client code here
   ```

   `places/myplace/src/server/runtime.server.ts`:

   ```typescript
   import { initializeGameServer } from "game/server/bootstrap";

   // Initialize shared game systems
   initializeGameServer();

   print("[Server] MyPlace initialized");

   // Add place-specific server code here
   ```

   `places/myplace/src/shared/index.ts`:

   ```typescript
   export const PLACE_NAME = "MyPlace";
   export const PLACE_ID = "myplace";
   ```

5. **Add to mantle.yml:**

   ```yaml
   places:
     start:
       assetId: ${{ secrets.START_PLACE_ID }}
       file: places/start/start.rbxlx

     myplace: # Add your new place
       assetId: ${{ secrets.MYPLACE_ID }}
       file: places/myplace/myplace.rbxlx
   ```

6. **Add npm scripts** to `package.json` (done automatically by add-place script):
   ```json
   "build:myplace": "rbxtsc -p tsconfig.myplace.json --rojo build-myplace.project.json",
   "watch:myplace": "rbxtsc -w -p tsconfig.myplace.json --rojo build-myplace.project.json",
   "serve:myplace": "rojo serve src/places/myplace/myplace.project.json",
   "dev:myplace": "concurrently \"npm run watch:myplace\" \"npm run serve:myplace\""
   ```

## 🛠️ Development Commands

### Building

```bash
npm run build              # Build all places (uses base tsconfig)
npm run build:start        # Build start place only (recommended for dev)
npm run build:<place>      # Build specific place (after adding with add-place)
npm run watch              # Watch mode - rebuilds all places on changes
npm run watch:start        # Watch mode for start place only
npm run watch:<place>      # Watch mode for specific place
```

### Serving with Rojo

```bash
npm run serve              # Serve default project
npm run serve:start        # Serve start place
npm run serve:<place>      # Serve specific place
```

### Development (Watch + Serve)

```bash
npm run dev                # Watch + serve (all places)
npm run dev:start          # Watch + serve start place (recommended)
npm run dev:<place>        # Watch + serve specific place
```

### Place Management Scripts

```bash
npm run add-place <name>      # Scaffold a new place with all files
npm run remove-place <name>   # Completely remove a place and all its files
npm run build-place <name>    # Build a place's .rbxlx file using Rojo
```

**Examples:**

```bash
npm run add-place lobby       # Creates places/lobby with all config files
npm run remove-place lobby    # Removes lobby and cleans up all references
npm run build-place start     # Builds out/places/start/start.rbxlx
```

### Deployment with Mantle

```bash
npm run mantle:deploy      # Deploy all places to Roblox
npm run mantle:outputs     # View deployment outputs (place IDs, etc.)
```

### Asset Syncing with Asphalt

```bash
npm run asphalt:sync       # Sync assets to Roblox
npm run asphalt:sync-dev   # Sync assets for development
```

## 📦 How Code is Organized in Roblox

When you build and serve, the code appears in Roblox Studio like this:

```
ReplicatedStorage
├── Game/          ← Shared game logic (from game/shared)
├── TS/            ← Place-specific shared code
└── Assets/        ← Shared assets

ServerScriptService
├── Game/          ← Shared server logic (from game/server)
└── TS/            ← Place-specific server code

StarterPlayer.StarterPlayerScripts
├── Game/          ← Shared client logic (from game/client)
└── TS/            ← Place-specific client code
```

## 💡 Best Practices

### When to use Game folder:

- Core game systems (inventory, combat, etc.)
- Shared UI components and themes
- Data models used across all places
- Network events/remotes
- Shared utilities and helpers

### When to use Place-specific folder:

- Place-unique gameplay mechanics
- Place-specific UI overlays
- Place configuration and constants
- Place-specific services or controllers
- Overrides of shared functionality

### Example: Teleportation System

**In `game/shared/network/index.ts`:**

```typescript
export const teleportEvent = new RemoteEvent<[placeId: number]>();
```

**In `game/server/services/teleport-service.ts`:**

```typescript
export class TeleportService {
  private teleportToPlace(player: Player, placeId: number) {
    // Shared teleport logic
  }
}
```

**In `places/lobby/src/server/runtime.server.ts`:**

```typescript
import { TeleportService } from "game/server/services/teleport-service";
import { ARENA_PLACE_ID } from "../shared";

// Lobby-specific: Start game button
teleportEvent.connect((player) => {
  TeleportService.teleportToPlace(player, ARENA_PLACE_ID);
});
```

## 🔧 TypeScript Path Mapping

The `tsconfig.json` is configured to allow these imports:

```typescript
// From any file, import shared game code:
import { PlayerData } from "game/shared/data/player-data";
import { DataService } from "game/server/services/data-service";
import { UIController } from "game/client/controllers/ui-controller";

// Also maintains backwards compatibility:
import { PlayerData } from "shared/data/player-data";
```

## 🚨 Important Notes

1. **Use per-place commands for development**: Always use `npm run dev:start` or `npm run dev:<place>` instead of `npm run dev` to avoid path conflicts
2. **Build before syncing**: If you change code, make sure to run the build command first
3. **Each place has its own tsconfig**: This ensures Flamework paths compile correctly for that place
4. **Shared code changes affect all places**: Changes to `game/` will be available in all places after rebuild
5. **Use Mantle for deployment**: It handles deploying all places to the same experience
6. **The `start` place is protected**: It cannot be removed with the remove-place script

## 📚 Additional Resources

- [Roblox-TS Documentation](https://roblox-ts.com/)
- [Mantle Documentation](https://mantledeploy.vercel.app/)
- [Rojo Documentation](https://rojo.space/)
