import { command } from "knub";
import { BotControlPluginType } from "../types";
import { isOwnerPreFilter } from "../../../pluginUtils";
import { getActiveReload, setActiveReload } from "../activeReload";
import { TextChannel } from "eris";

export const ReloadGlobalPluginsCmd = command<BotControlPluginType>()({
  trigger: "bot_reload_global_plugins",
  permission: null,
  config: {
    preFilters: [isOwnerPreFilter],
  },

  async run({ pluginData, message }) {
    if (getActiveReload()) return;

    setActiveReload((message.channel as TextChannel).guild?.id, message.channel.id);
    await message.channel.createMessage("Reloading global plugins...");

    pluginData.getKnubInstance().reloadAllGlobalPlugins();
  },
});
