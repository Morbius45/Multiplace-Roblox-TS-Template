import { World, useThrottle } from "@rbxts/matter";
import { Health, Damage, Dead } from "../components";

/**
 * Health System
 * Processes damage and marks entities as dead when health reaches 0
 */
export function healthSystem(world: World): void {
  // Process pending damage
  for (const [id, health, damage] of world
    .query(Health, Damage)
    .without(Dead)) {
    const newHealth = math.max(0, health.current - damage.amount);

    // Update health
    world.insert(id, health.patch({ current: newHealth }));

    // Remove the damage component (it's been processed)
    world.remove(id, Damage);

    // Mark as dead if health depleted
    if (newHealth <= 0) {
      world.insert(id, Dead());
      print(`[HealthSystem] Entity ${id} died`);
    }
  }
}

/**
 * Health Regeneration System
 * Slowly regenerates health for living entities
 * Runs every 2 seconds
 */
export function healthRegenSystem(world: World): void {
  // Only run every 2 seconds
  if (!useThrottle(2)) return;

  for (const [id, health] of world.query(Health).without(Dead)) {
    if (health.current < health.max) {
      const regenAmount = math.ceil(health.max * 0.05); // 5% regen
      const newHealth = math.min(health.max, health.current + regenAmount);

      world.insert(id, health.patch({ current: newHealth }));
    }
  }
}
