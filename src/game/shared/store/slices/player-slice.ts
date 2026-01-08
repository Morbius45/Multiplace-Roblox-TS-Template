// Player Slice

import { createProducer } from "@rbxts/reflex";
import type { PlayerData } from "../../data/player-data";

export interface PlayerState {
	data: Record<string, PlayerData>;
}

const initialState: PlayerState = {
	data: {},
};

export const playerSlice = createProducer(initialState, {
	setPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		data: { ...state.data, [playerId]: data },
	}),

	removePlayerData: (state, playerId: string) => {
		const newData = { ...state.data };
		delete newData[playerId];
		return { data: newData };
	},
});
