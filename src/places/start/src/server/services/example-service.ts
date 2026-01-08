import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

/**
 * Example place-specific service using Flamework.
 * This service is only loaded in the "start" place.
 *
 * For shared services used across all places, add them to:
 * src/game/server/services/
 */
@Service()
export class ExamplePlaceService implements OnStart {
  onStart() {
    Players.PlayerAdded.Connect((player) => {
      print(`[Start Place] Player joined: ${player.Name}`);
    });

    // Handle players already in game
    for (const player of Players.GetPlayers()) {
      print(`[Start Place] Player already here: ${player.Name}`);
    }

    print("[ExamplePlaceService] Started");
  }
}
