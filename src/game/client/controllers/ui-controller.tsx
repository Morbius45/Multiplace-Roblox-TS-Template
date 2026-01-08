// UI Controller - Mounts React UI

import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import React from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import ReactReflex from "@rbxts/react-reflex";
import { store } from "shared/store";
import { App } from "../ui/app";

const { ReflexProvider } = ReactReflex;

@Controller()
export class UIController implements OnStart {
  private root?: ReturnType<typeof createRoot>;

  onStart() {
    const playerGui = Players.LocalPlayer.WaitForChild(
      "PlayerGui",
    ) as PlayerGui;

    const screenGui = new Instance("ScreenGui");
    screenGui.Name = "GameUI";
    screenGui.ResetOnSpawn = false;
    screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
    screenGui.IgnoreGuiInset = true;
    screenGui.Parent = playerGui;

    this.root = createRoot(screenGui);
    this.root.render(
      <ReflexProvider producer={store}>
        <App />
      </ReflexProvider>,
    );

    print("[UIController] Started");
  }
}
