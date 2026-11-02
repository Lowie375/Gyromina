import emojiRegex from "emoji-regex"
import { Caller } from "./command";
import { GuildEmoji, PermissionsBitField } from "discord.js";
import { hasPermissions } from "./globalFunctions";
const regex = emojiRegex();

export enum GyrominaEmoji {
  Yep,
  Nope,
  Warning,
  Stable,
  Unstable,
  Hidden,
  Deprecated,
  PollYes,
  PollNeutral,
  PollNo,
  Dyno
}

export enum EmojiType {
  Unicode,
  Custom,
  NotFound
}

export type EmojiRecord = {
  id: string,
  type: EmojiType
}

export type EmojiData = {
  id: string,
  fallback: string
}

// {
//   "m": {
//       "success": "💥",
//       "clue": "🔍",
//       "fail": "❌"
//     }
//   }
// }

/**
 * Maps an emoji to its data
 * @param emoji Emoji to map
 * @returns Data needed to use the emoji
 */
function mapEmoji(emoji: GyrominaEmoji): EmojiData {
  switch (emoji) {
    case GyrominaEmoji.Yep: return {id: "647926856615723008", fallback: "✅"};
    case GyrominaEmoji.Nope: return {id: "618199093520498789", fallback: "❌"};
    case GyrominaEmoji.Warning: return {id: "618198843301036032", fallback: "⚠️"};
    case GyrominaEmoji.Stable: return {id: "647926856615723008", fallback: "✅"};
    case GyrominaEmoji.Unstable: return {id: "618198843301036032", fallback: "⚠️"};
    case GyrominaEmoji.Hidden: return {id: "618181399299751937", fallback: "👻"};
    case GyrominaEmoji.Deprecated: return {id: "618199093520498789", fallback: "❌"};
    case GyrominaEmoji.PollYes: return {id: "647926856615723008", fallback: "✅"};
    case GyrominaEmoji.PollNeutral: return {id: "704915116923027524", fallback: "➖"};
    case GyrominaEmoji.PollNo: return {id: "618199093520498789", fallback: "❌"};
    case GyrominaEmoji.Dyno: return {id: "821445763258646548", fallback: "🔄"};
  }
}

/** Gets the appropriate Gyromina emoji to use in a message
 * @param caller Caller object
 * @param emoji Gyromina emoji to use
 * @return Emoji to use
 */
export function getEmoji(caller: Caller, emoji: GyrominaEmoji): GuildEmoji | string {
  const emojiRecord = mapEmoji(emoji);
  if (emojiRecord.id && hasPermissions(caller, new PermissionsBitField().add(PermissionsBitField.Flags.UseExternalEmojis))) {
    return caller.client.emojis.cache.get(emojiRecord.id);
  } else {
    return emojiRecord.fallback;
  }
}

/** Finds the first valid emoji in a list, prioritizing Unicord emoji over custom Discord emoji
 * @param emojiList List to check
 * @return Emoji if found, or EmojiRecord with type EmojiType.NotFound
 */
export function getFirstValidEmoji(emojiList: string[] = []): EmojiRecord {
  let save = [];
  for (const e of emojiList) {
    let match = regex.exec(e);
    regex.lastIndex = 0;
    if (match)
      save.push(match[0]);
  }

  if (save.length !== 0) {
    // Unicode emoji
    return {type: EmojiType.Unicode, id: save[0]};
  } else {
    // Check for custom emoji
    for (const e of emojiList) {
      let pEmojiID = e.split("<")[1]
      if (pEmojiID) {
        let qEmojiID = pEmojiID.split(":");
        let junk = e.split("<")[0].length;
        if (qEmojiID[2] && e.slice(junk).startsWith("<") && qEmojiID[2].slice(-1) == ">")
          return {type: EmojiType.Custom, id: qEmojiID[2].slice(0, -1)};
      }
      return {type: EmojiType.NotFound, id: ""};
    }
  }
};
