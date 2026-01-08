// State Controller - Syncs state with server

import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { store } from "shared/store";
import { remotes } from "shared/network";
import type { PlayerData } from "shared/data/player-data";

@Controller()
export class StateController implements OnStart {
  private localPlayerId = tostring(Players.LocalPlayer.UserId);

  onStart() {
    remotes.player.syncData.connect((data: PlayerData) => {
      store.setPlayerData(this.localPlayerId, data);
    });

    remotes.player.requestData.fire();
    print("[StateController] Started");
  }

  public getStore() {
    return store;
  }
}
