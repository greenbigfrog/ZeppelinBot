import { PluginOptions } from "knub";
import { ConfigSchema, LocateUserPluginType } from "./types";
import { zeppelinPlugin } from "../ZeppelinPluginBlueprint";
import { GuildVCAlerts } from "src/data/GuildVCAlerts";
import { outdatedAlertsLoop } from "./utils/outdatedLoop";
import { fillActiveAlertsList } from "./utils/fillAlertsList";
import { WhereCmd } from "./commands/WhereCmd";
import { FollowCmd } from "./commands/FollowCmd";
import { DeleteFollowCmd, ListFollowCmd } from "./commands/ListFollowCmd";
import { ChannelJoinAlertsEvt, ChannelLeaveAlertsEvt, ChannelSwitchAlertsEvt } from "./events/SendAlertsEvts";
import { GuildBanRemoveAlertsEvt } from "./events/BanRemoveAlertsEvt";
import { trimPluginDescription } from "../../utils";

const defaultOptions: PluginOptions<LocateUserPluginType> = {
  config: {
    can_where: false,
    can_alert: false,
  },
  overrides: [
    {
      level: ">=50",
      config: {
        can_where: true,
        can_alert: true,
      },
    },
  ],
};

export const LocateUserPlugin = zeppelinPlugin<LocateUserPluginType>()("locate_user", {
  showInDocs: true,
  info: {
    prettyName: "Locate user",
    description: trimPluginDescription(`
      This plugin allows users with access to the commands the following:
      * Instantly receive an invite to the voice channel of a user
      * Be notified as soon as a user switches or joins a voice channel
    `),
  },

  configSchema: ConfigSchema,
  defaultOptions,

  // prettier-ignore
  commands: [
    WhereCmd,
    FollowCmd,
    ListFollowCmd,
    DeleteFollowCmd,
  ],

  // prettier-ignore
  events: [
    ChannelJoinAlertsEvt,
    ChannelSwitchAlertsEvt,
    ChannelLeaveAlertsEvt,
    GuildBanRemoveAlertsEvt
  ],

  onLoad(pluginData) {
    const { state, guild } = pluginData;

    state.alerts = GuildVCAlerts.getGuildInstance(guild.id);
    state.outdatedAlertsTimeout = null;
    state.usersWithAlerts = [];
    state.unloaded = false;

    outdatedAlertsLoop(pluginData);
    fillActiveAlertsList(pluginData);
  },

  onUnload(pluginData) {
    clearTimeout(pluginData.state.outdatedAlertsTimeout);
    pluginData.state.unloaded = true;
  },
});
