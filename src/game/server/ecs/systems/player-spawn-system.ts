import { World, useEvent } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import {
  PlayerEntity,
  Transform,
  Health,
  Renderable,
} from "game/shared/ecs/components";

/**
 * Player Spawn System
 * Creates ECS entities for players when they join
 * Removes entities when players leave
 */
export function playerSpawnSystem(world: World): void {
  // Handle player joining
  for (const [_, player] of useEvent(Players, "PlayerAdded")) {
    player.CharacterAdded.Connect((character) => {
      const humanoid = character.WaitForChild("Humanoid") as Humanoid;
      const rootPart = character.WaitForChild("HumanoidRootPart") as BasePart;

      const entityId = world.spawn(
        PlayerEntity({ player, userId: player.UserId }),
        Transform({
          position: rootPart.Position,
          rotation: rootPart.CFrame,
        }),
        Health({
          current: humanoid.Health,
          max: humanoid.MaxHealth,
        }),
        Renderable({ instance: character })
      );

      print(
        `[PlayerSpawnSystem] Created entity ${entityId} for ${player.Name}`
      );

      // Clean up entity when character dies/respawns
      humanoid.Died.Connect(() => {
        if (world.contains(entityId)) {
          world.despawn(entityId);
          print(
            `[PlayerSpawnSystem] Despawned entity ${entityId} (character died)`
          );
        }
      });
    });

    // Handle existing character
    if (player.Character) {
      player.CharacterAdded.Wait();
    }
  }

  // Handle player leaving
  for (const [_, player] of useEvent(Players, "PlayerRemoving")) {
    for (const [id, playerEntity] of world.query(PlayerEntity)) {
      if (playerEntity.userId === player.UserId) {
        world.despawn(id);
        print(
          `[PlayerSpawnSystem] Despawned entity ${id} for leaving player ${player.Name}`
        );
        break;
      }
    }
  }
}
