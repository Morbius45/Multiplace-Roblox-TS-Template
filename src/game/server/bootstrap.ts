// Game Server Bootstrap Module
// This module initializes all shared server systems using Flamework

import { Flamework } from "@flamework/core";
import { Players } from "@rbxts/services";

// Track if already ignited (for multiplace safety)
let ignited = false;

export function initializeGameServer() {
  if (ignited) {
    warn("[Server] Flamework already ignited, skipping...");
    return;
  }
  ignited = true;

  // Add paths for shared game services and components
  Flamework.addPaths("out/game/server/services");
  Flamework.addPaths("out/game/server/components");

  print("[Server] Game core initialized");
  print(
    `[Server] Waiting for players... (${Players.GetPlayers().size()} connected)`,
  );
}

export function igniteServer() {
  Flamework.ignite();
  print("[Server] Flamework ignited");
}
