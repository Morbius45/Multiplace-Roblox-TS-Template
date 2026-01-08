import { Controller, OnStart, OnInit } from "@flamework/core";
import { RunService } from "@rbxts/services";
import { World, Loop, AnySystem } from "@rbxts/matter";

// Client-only systems
import { renderSystem } from "../ecs/systems";

/**
 * Client-side state passed to all systems
 */
export interface ClientMatterState {
  // Add any client-specific state
  // Example: localPlayer, camera, input state, etc.
}

/**
 * MatterController - Client-side ECS World Management
 *
 * This controller manages a client-side Matter ECS world for:
 * - Local entity prediction
 * - Visual effects entities
 * - UI-driven entities
 * - Client-only simulations
 *
 * Note: For most games, the server MatterService is the source of truth.
 * Use client-side Matter for prediction/interpolation if needed.
 *
 * @example
 * ```typescript
 * import { Controller, Dependency } from "@flamework/core";
 * import { MatterController } from "./matter-controller";
 *
 * @Controller()
 * export class VFXController {
 *   private matter = Dependency<MatterController>();
 *
 *   spawnParticle(position: Vector3) {
 *     const world = this.matter.getWorld();
 *     return world.spawn(
 *       Transform({ position, rotation: CFrame.identity }),
 *       Particle({ lifetime: 2, color: Color3.new(1, 0, 0) }),
 *     );
 *   }
 * }
 * ```
 */
@Controller()
export class MatterController implements OnInit, OnStart {
  public readonly world = new World();
  private readonly state: ClientMatterState = {};
  private loop: Loop<[World, ClientMatterState]>;
  private started = false;

  constructor() {
    this.loop = new Loop(this.world, this.state);
  }

  onInit() {
    // Schedule client systems
    this.loop.scheduleSystems([renderSystem]);

    print("[MatterController] Client systems scheduled");
  }

  onStart() {
    // Start the client game loop
    this.loop.begin({
      default: RunService.Heartbeat,
      render: RunService.RenderStepped,
    });

    this.started = true;
    print("[MatterController] Client ECS World started");
  }

  /**
   * Get the client ECS World
   */
  public getWorld(): World {
    return this.world;
  }

  /**
   * Get the client state object
   */
  public getState(): ClientMatterState {
    return this.state;
  }

  /**
   * Add additional systems at runtime
   */
  public addSystems(systems: AnySystem[]): void {
    this.loop.scheduleSystems(systems);

    if (this.started) {
      print(`[MatterController] Added ${systems.size()} systems`);
    }
  }
}
