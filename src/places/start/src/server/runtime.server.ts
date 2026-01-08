// Place-specific server runtime for Start place
import { Flamework } from "@flamework/core";
import { initializeGameServer, igniteServer } from "game/server/bootstrap";

// Initialize shared game systems (adds game paths)
initializeGameServer();

// Add place-specific paths
Flamework.addPaths("out/places/start/src/server/services");
Flamework.addPaths("out/places/start/src/server/components");

// Ignite Flamework (starts all services)
igniteServer();

// Place-specific initialization
print("[Server] Start place initialized");
