import { World } from "@rbxts/matter";
import { Transform, Renderable, Dead } from "game/shared/ecs/components";

/**
 * Render System
 * Syncs Roblox instances with ECS Transform components
 * Only runs on client for visual updates
 */
export function renderSystem(world: World): void {
  // Update instance positions when Transform changes
  for (const [id, record] of world.queryChanged(Transform)) {
    // Skip if transform was removed
    if (record.new === undefined) continue;

    const renderable = world.get(id, Renderable);
    if (!renderable?.instance) continue;

    // Skip dead entities
    if (world.get(id, Dead)) continue;

    const instance = renderable.instance;

    // Update position based on instance type
    if (instance.IsA("Model")) {
      if (instance.PrimaryPart) {
        instance.PrimaryPart.CFrame = record.new.rotation.add(
          record.new.position
        );
      }
    } else if (instance.IsA("BasePart")) {
      instance.CFrame = record.new.rotation.add(record.new.position);
    }
  }
}
