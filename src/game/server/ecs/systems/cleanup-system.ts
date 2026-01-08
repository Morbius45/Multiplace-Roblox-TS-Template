import { World } from "@rbxts/matter";
import { Dead, Renderable } from "game/shared/ecs/components";

/**
 * Cleanup System
 * Removes dead entities after a delay
 * Cleans up associated Roblox instances
 */
export function cleanupSystem(world: World): void {
  for (const [id, _dead, renderable] of world.query(Dead, Renderable)) {
    // Destroy the Roblox instance if it exists
    if (renderable.instance && renderable.instance.Parent) {
      renderable.instance.Destroy();
    }

    // Despawn the entity
    world.despawn(id);
    print(`[CleanupSystem] Cleaned up entity ${id}`);
  }

  // Also clean up dead entities without renderables
  for (const [id] of world.query(Dead).without(Renderable)) {
    world.despawn(id);
  }
}
