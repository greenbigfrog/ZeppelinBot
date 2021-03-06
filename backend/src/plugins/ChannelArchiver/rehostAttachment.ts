import { Attachment, TextChannel } from "eris";
import { downloadFile } from "src/utils";
import fs from "fs";
const fsp = fs.promises;

const MAX_ATTACHMENT_REHOST_SIZE = 1024 * 1024 * 8;

export async function rehostAttachment(attachment: Attachment, targetChannel: TextChannel): Promise<string> {
  if (attachment.size > MAX_ATTACHMENT_REHOST_SIZE) {
    return "Attachment too big to rehost";
  }

  let downloaded;
  try {
    downloaded = await downloadFile(attachment.url, 3);
  } catch (e) {
    return "Failed to download attachment after 3 tries";
  }

  try {
    const rehostMessage = await targetChannel.createMessage(`Rehost of attachment ${attachment.id}`, {
      name: attachment.filename,
      file: await fsp.readFile(downloaded.path),
    });
    return rehostMessage.attachments[0].url;
  } catch (e) {
    return "Failed to rehost attachment";
  }
}
