// Game Client Bootstrap Module
// This module initializes all shared client systems using Flamework

import { Flamework } from "@flamework/core";

// Track if already ignited (for multiplace safety)
let ignited = false;

export function initializeGameClient() {
  if (ignited) {
    warn("[Client] Flamework already ignited, skipping...");
    return;
  }
  ignited = true;

  // Add paths for shared game controllers and components
  Flamework.addPaths("out/game/client/controllers");
  Flamework.addPaths("out/game/client/components");

  print("[Client] Game core initialized");
}

export function igniteClient() {
  Flamework.ignite();
  print("[Client] Flamework ignited");
}
