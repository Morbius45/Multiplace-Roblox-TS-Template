import { World, useDeltaTime } from "@rbxts/matter";
import { Transform, Velocity, Dead } from "../components";

/**
 * Movement System
 * Updates Transform based on Velocity for all entities
 * Skips dead entities
 */
export function movementSystem(world: World): void {
  const dt = useDeltaTime();

  for (const [id, transform, velocity] of world
    .query(Transform, Velocity)
    .without(Dead)) {
    // Skip if no movement
    if (velocity.speed === 0) continue;

    // Calculate new position
    const displacement = velocity.direction.Unit.mul(velocity.speed * dt);
    const newPosition = transform.position.add(displacement);

    // Update transform
    world.insert(
      id,
      transform.patch({
        position: newPosition,
      })
    );
  }
}
