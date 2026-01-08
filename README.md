# Roblox-TS Multiplace Template

A comprehensive Roblox-TS **multiplace game template** featuring:

- **[Flamework](https://flamework.fireboltofdeath.dev/)** - Dependency injection and lifecycle management
- **[Matter](https://github.com/evaera/matter)** - ECS (Entity Component System) for game logic
- **[Lapis](https://github.com/nezuo/lapis)** - DataStore wrapper with automatic retries and session locking
- **[Remo](https://github.com/littensy/remo)** - Type-safe networking library
- **[Reflex](https://github.com/littensy/reflex)** - Rodux-inspired state management
- **[React](https://github.com/littensy/rbxts-react)** - React 18 for Roblox UI
- **[Mantle](https://mantledeploy.vercel.app/)** - Infrastructure as code for deployment
- **[Asphalt](https://github.com/jacktabscode/asphalt)** - Asset management and syncing

## 🎮 Multiplace Architecture

This template is designed as a **multiplace framework**, allowing you to:

- Create multiple places (levels/worlds) in one experience
- Share common game logic across all places via the `src/game/` folder
- Have place-specific code in each place's `src/` folder
- Use Flamework's `@Service` and `@Controller` decorators for auto-discovery

**📖 [Read the Complete Multiplace Guide](./MULTIPLACE_GUIDE.md)**

## 🚀 Quick Start

### 1. Clone or Use Template

```bash
# Using degit (recommended - no git history)
npx degit your-username/roblox-ts-multiplace-template my-game
cd my-game

# Or clone directly
git clone https://github.com/your-username/roblox-ts-multiplace-template.git my-game
cd my-game
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development

```bash
npm run dev:start
```

### 4. Sync with Roblox Studio

- Install the [Rojo plugin](https://rojo.space/) in Roblox Studio
- Click "Connect" in the Rojo plugin panel

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rojo](https://rojo.space/) (v7+)
- [Mantle](https://mantledeploy.vercel.app/docs/installation) (for deployment)
- [Rokit](https://github.com/rojo-rbx/rokit) (recommended for tool management)

## Project Structure

```
src/
├── game/                      # Shared logic for ALL places
│   ├── client/                # Shared client code
│   │   ├── bootstrap.ts       # Flamework initialization
│   │   ├── controllers/       # Shared controllers (MatterController, etc.)
│   │   ├── components/        # Shared Flamework components
│   │   ├── ecs/systems/       # Client ECS systems
│   │   └── ui/                # React UI components
│   │
│   ├── server/                # Shared server code
│   │   ├── bootstrap.ts       # Flamework initialization
│   │   ├── services/          # Shared services (MatterService, DataService)
│   │   ├── components/        # Shared Flamework components
│   │   └── ecs/systems/       # Server ECS systems
│   │
│   └── shared/                # Shared code (client & server)
│       ├── ecs/               # ECS components and shared systems
│       │   ├── components/    # Matter component definitions
│       │   └── systems/       # Shared ECS systems
│       ├── network/           # Remo network definitions
│       ├── store/             # Reflex state management
│       ├── data/              # Lapis data schemas
│       └── types/             # Shared types
│
└── places/                    # Individual places
    └── start/                 # Start place (example)
        ├── start.project.json # Rojo config for development
        └── src/
            ├── client/        # Place-specific client code
            │   └── runtime.client.ts
            ├── server/        # Place-specific server code
            │   ├── runtime.server.ts
            │   └── services/  # Place-specific services
            └── shared/        # Place-specific shared code
```

## Commands

### Development

| Command               | Description                             |
| --------------------- | --------------------------------------- |
| `npm run dev:start`   | Watch + serve start place (recommended) |
| `npm run build:start` | Build start place only                  |
| `npm run watch:start` | Watch mode for start place              |
| `npm run serve:start` | Serve start place with Rojo             |

### Place Management

| Command                       | Description                              |
| ----------------------------- | ---------------------------------------- |
| `npm run add-place <name>`    | Create a new place with all config files |
| `npm run remove-place <name>` | Remove a place and clean up references   |
| `npm run build-place <name>`  | Build a place's .rbxlx file              |

### Deployment

| Command                  | Description                 |
| ------------------------ | --------------------------- |
| `npm run mantle:deploy`  | Deploy all places to Roblox |
| `npm run mantle:outputs` | View deployment outputs     |
| `npm run asphalt:sync`   | Sync assets to Roblox       |

## Adding a New Place

```bash
npm run add-place lobby
```

This creates:

- `src/places/lobby/` with runtime files and Rojo config
- `tsconfig.lobby.json` for per-place compilation
- `build-lobby.project.json` for Rojo builds
- npm scripts: `dev:lobby`, `build:lobby`, `watch:lobby`, `serve:lobby`

## Architecture

### Flamework Integration

Services and controllers are auto-discovered using Flamework decorators:

```typescript
// src/game/server/services/my-service.ts
import { Service, OnStart } from "@flamework/core";

@Service()
export class MyService implements OnStart {
  onStart() {
    print("MyService started!");
  }
}
```

### Matter ECS Integration

The template includes Matter ECS for entity management. Access it via Flamework DI:

```typescript
import { Service, Dependency } from "@flamework/core";
import { MatterService } from "./matter-service";
import { Transform, Health, Enemy } from "game/shared/ecs/components";

@Service()
export class EnemyService {
  private matter = Dependency<MatterService>();

  spawnEnemy(position: Vector3) {
    return this.matter
      .getWorld()
      .spawn(
        Enemy({ enemyType: "zombie", level: 1 }),
        Transform({ position, rotation: CFrame.identity }),
        Health({ current: 100, max: 100 })
      );
  }
}
```

### Data Flow

```
Client Action → Remo → Server Service → Lapis (DataStore)
                                      ↓
                               Reflex Store
                                      ↓
Client ← Remo Broadcast ← Store Changes
                ↓
           React UI Update

ECS Flow:
Entities → Systems (each frame) → Component Updates → Roblox Instances
```

## Configuration

### Mantle (`mantle.yml`)

Configure deployment settings and place IDs:

```yaml
places:
  start:
    file: src/places/start/start.rbxlx
    configuration:
      name: "My Game"
```

### Per-Place Development

Each place has its own tsconfig to ensure Flamework paths compile correctly:

- `tsconfig.start.json` → Use with `npm run dev:start`
- `tsconfig.lobby.json` → Use with `npm run dev:lobby` (after adding)

## License

MIT
