// Remo Network Definitions

import Remo from "@rbxts/remo";
import type { PlayerData } from "../data/player-data";

const { createRemotes, remote, namespace } = Remo;
type Client = Remo.Client;
type Server = Remo.Server;

export const remotes = createRemotes({
	player: namespace({
		requestData: remote<Server>(),
		syncData: remote<Client, [data: PlayerData]>(),
	}),

	// Add your remotes here
});

export type Remotes = typeof remotes;
