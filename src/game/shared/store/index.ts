// Reflex Store

import { combineProducers, InferState } from "@rbxts/reflex";
import { playerSlice } from "./slices/player-slice";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export const store = combineProducers({
	player: playerSlice,
});

export { playerSlice };
