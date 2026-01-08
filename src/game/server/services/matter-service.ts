import { Service, OnStart, OnInit } from "@flamework/core";
import { RunService } from "@rbxts/services";
import { World, Loop, AnySystem } from "@rbxts/matter";

// Shared systems
import {
  movementSystem,
  healthSystem,
  healthRegenSystem,
} from "game/shared/ecs/systems";

// Server-only systems
import { playerSpawnSystem, cleanupSystem } from "../ecs/systems";

/**
 * Shared state passed to all systems
 */
export interface MatterState {
  // Add any shared state your systems need
  // Example: deltaTime, serverTime, etc.
}

/**
 * MatterService - Server-side ECS World Management
 *
 * This service manages the Matter ECS world and loop on the server.
 * Use Dependency<MatterService>() to access the world from other services.
 *
 * @example
 * ```typescript
 * import { Service, Dependency } from "@flamework/core";
 * import { MatterService } from "./matter-service";
 *
 * @Service()
 * export class EnemyService {
 *   private matter = Dependency<MatterService>();
 *
 *   spawnEnemy(position: Vector3) {
 *     const world = this.matter.getWorld();
 *     return world.spawn(
 *       Enemy({ enemyType: "zombie", level: 1 }),
 *       Transform({ position, rotation: CFrame.identity }),
 *       Health({ current: 100, max: 100 }),
 *     );
 *   }
 * }
 * ```
 */
@Service()
export class MatterService implements OnInit, OnStart {
  public readonly world = new World();
  private readonly state: MatterState = {};
  private loop: Loop<[World, MatterState]>;
  private started = false;

  constructor() {
    this.loop = new Loop(this.world, this.state);
  }

  onInit() {
    // Schedule core systems
    this.loop.scheduleSystems([
      // Shared systems
      movementSystem,
      healthSystem,
      healthRegenSystem,

      // Server-only systems
      playerSpawnSystem,
      cleanupSystem,
    ]);

    print("[MatterService] Systems scheduled");
  }

  onStart() {
    // Start the game loop
    this.loop.begin({
      default: RunService.Heartbeat,
    });

    this.started = true;
    print("[MatterService] ECS World started");
  }

  /**
   * Get the ECS World for spawning/querying entities
   */
  public getWorld(): World {
    return this.world;
  }

  /**
   * Get the shared state object
   */
  public getState(): MatterState {
    return this.state;
  }

  /**
   * Add additional systems at runtime (for place-specific systems)
   * Must be called before onStart, or systems won't run until next frame
   */
  public addSystems(systems: AnySystem[]): void {
    this.loop.scheduleSystems(systems);

    if (this.started) {
      print(
        `[MatterService] Added ${systems.size()} systems (will run next frame)`
      );
    }
  }
}
