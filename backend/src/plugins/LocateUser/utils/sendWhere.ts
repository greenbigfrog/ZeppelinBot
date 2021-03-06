import { Member, TextableChannel, VoiceChannel } from "eris";
import { getInviteLink } from "knub/dist/helpers";
import { createOrReuseInvite } from "./createOrReuseInvite";
import { PluginData } from "knub";
import { LocateUserPluginType } from "../types";
import { sendErrorMessage } from "../../../pluginUtils";

export async function sendWhere(
  pluginData: PluginData<LocateUserPluginType>,
  member: Member,
  channel: TextableChannel,
  prepend: string,
) {
  const voice = pluginData.guild.channels.get(member.voiceState.channelID) as VoiceChannel;

  if (voice == null) {
    channel.createMessage(prepend + "That user is not in a channel");
  } else {
    let invite = null;
    try {
      invite = await createOrReuseInvite(voice);
    } catch (e) {
      sendErrorMessage(pluginData, channel, "Cannot create an invite to that channel!");
      return;
    }
    channel.createMessage(
      prepend + `${member.mention} is in the following channel: \`${voice.name}\` ${getInviteLink(invite)}`,
    );
  }
}
