// Place-specific client runtime for Start place
import { Flamework } from "@flamework/core";
import { initializeGameClient, igniteClient } from "game/client/bootstrap";

// Initialize shared game systems (adds game paths)
initializeGameClient();

// Add place-specific paths
Flamework.addPaths("out/places/start/src/client/controllers");
Flamework.addPaths("out/places/start/src/client/components");

// Ignite Flamework (starts all controllers)
igniteClient();

// Place-specific initialization
print("[Client] Start place initialized");
