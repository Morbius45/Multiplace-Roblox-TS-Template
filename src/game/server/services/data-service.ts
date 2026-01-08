// Data Service - Player data persistence with Lapis

import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { createCollection, Document } from "@rbxts/lapis";
import { PlayerData, DEFAULT_PLAYER_DATA } from "shared/data/player-data";
import { store } from "shared/store";
import { remotes } from "shared/network";

const playerCollection = createCollection<PlayerData>("PlayerData", {
  defaultData: DEFAULT_PLAYER_DATA,
  validate: (data): data is PlayerData => {
    return (
      data !== undefined && typeIs((data as PlayerData).joinedAt, "number")
    );
  },
});

type PlayerDocument = Document<PlayerData>;

@Service()
export class DataService implements OnStart {
  private documents = new Map<Player, PlayerDocument>();

  onStart() {
    Players.PlayerAdded.Connect((player) => this.onPlayerAdded(player));
    Players.PlayerRemoving.Connect((player) => this.onPlayerRemoving(player));

    for (const player of Players.GetPlayers()) {
      task.spawn(() => this.onPlayerAdded(player));
    }

    // Handle client requestData remote
    remotes.player.requestData.connect((player) => {
      const data = this.getData(player);
      if (data) {
        remotes.player.syncData.fire(player, data);
      }
    });

    print("[DataService] Started");
  }

  private async onPlayerAdded(player: Player) {
    try {
      const document = await playerCollection.load(`Player_${player.UserId}`, [
        player.UserId,
      ]);

      if (!player.IsDescendantOf(Players)) {
        await document.close();
        return;
      }

      this.documents.set(player, document);

      const data = document.read();
      if (data.joinedAt === 0) {
        document.write({ ...data, joinedAt: os.time() });
      }

      store.setPlayerData(tostring(player.UserId), document.read());
      remotes.player.syncData.fire(player, document.read());

      print(`[DataService] Loaded data for ${player.Name}`);
    } catch (err) {
      warn(`[DataService] Failed to load data for ${player.Name}: ${err}`);
      player.Kick("Failed to load data. Please rejoin.");
    }
  }

  private async onPlayerRemoving(player: Player) {
    const document = this.documents.get(player);
    if (document) {
      await document.close();
      this.documents.delete(player);
    }
    store.removePlayerData(tostring(player.UserId));
  }

  public getData(player: Player): PlayerData | undefined {
    return this.documents.get(player)?.read();
  }

  public updateData(
    player: Player,
    updater: (data: PlayerData) => PlayerData,
  ): boolean {
    const document = this.documents.get(player);
    if (!document) return false;

    const newData = updater(document.read());
    document.write(newData);
    store.setPlayerData(tostring(player.UserId), newData);
    remotes.player.syncData.fire(player, newData);

    return true;
  }
}
