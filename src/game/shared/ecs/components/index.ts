import { component } from "@rbxts/matter";

// ============================================
// Core Components
// ============================================

/**
 * Transform - Position and rotation in world space
 */
export const Transform = component<{
  position: Vector3;
  rotation: CFrame;
}>("Transform");

/**
 * Velocity - Movement direction and speed
 */
export const Velocity = component<{
  direction: Vector3;
  speed: number;
}>("Velocity");

// ============================================
// Combat Components
// ============================================

/**
 * Health - Current and maximum health
 */
export const Health = component<{
  current: number;
  max: number;
}>("Health");

/**
 * Damage - Pending damage to be applied
 */
export const Damage = component<{
  amount: number;
  source?: number; // Entity ID of damage source
}>("Damage");

// ============================================
// Entity Type Components
// ============================================

/**
 * PlayerEntity - Links ECS entity to Roblox Player
 */
export const PlayerEntity = component<{
  player: Player;
  userId: number;
}>("PlayerEntity");

/**
 * Enemy - Marks entity as an enemy with type info
 */
export const Enemy = component<{
  enemyType: string;
  level: number;
}>("Enemy");

/**
 * NPC - Marks entity as a non-player character
 */
export const NPC = component<{
  npcId: string;
  dialogue?: string;
}>("NPC");

// ============================================
// Rendering Components
// ============================================

/**
 * Renderable - Links ECS entity to Roblox Model/Part
 */
export const Renderable = component<{
  instance: Model | BasePart;
}>("Renderable");

// ============================================
// Tag Components (no data, just markers)
// ============================================

/** Marks entity as dead - will be cleaned up */
export const Dead = component("Dead");

/** Marks entity for network replication */
export const Replicated = component("Replicated");

/** Marks entity as owned by local player (client prediction) */
export const LocallyOwned = component("LocallyOwned");
