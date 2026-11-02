import { ColorResolvable, EmbedBuilder, GuildEmoji, PermissionsBitField } from "discord.js";
import { Caller } from "./command"
import { EmbedCol, resolveEmbedCol } from "./style"
import { GyrominaEmoji } from "./emoji";

// UTIL

/** Writes to the console with time when it was ran
 * @author Nao (naoei)
 * @param message Message to log
 * @param startTime
 * @param useLocale Whether to use the user's locale or not
 */
export function write(message, startTime = null, useLocale = true) {
  let currentTime = Date.now() - startTime;
  let body = "";

  if (!useLocale && currentTime > 0) {
    body = currentTime.toString().padEnd(8) + message;
  } else if (useLocale) {
    let time = new Date(Date.now()).toLocaleTimeString();
    body = time.padEnd(12) + message;
  } else body = message;

  console.log(body)
};

/** Clears out any tags (notably @everyone).
 * @author Nao (naoei)
 * @param text The text to clean
 * @return {string} The cleaned text
 */
export function clean(text): string {
  if (typeof(text) === "string")
    return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  else
    return text;
};

/** Generates a random integer.
 * @param {number} min The minimum value that can be generated
 * @param {number} max The maximum value that can be generated
 * @return {number} The random integer generated
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  let output = Math.floor(Math.random() * (max - min + 1)) + min
  if (output > max) output = max;
  return output;
};

/** Constrains a number between a minimum and a maximum value
 * @param {number} n The number to constrain
 * @param {number} min The minimum
 * @param {number} max The maximum
 * @return {number} The number, constrained between `min` and `max`
 */
export function minMax(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Checks whether Gyromina has a certain permission in the channel a message was sent in
 * @param caller Caller to check
 * @param perm Bitfield containing permissions to check for
 * @return Whether Gyromina has permissions in the channel
 */
export function hasPermissions(caller: Caller, permissions: PermissionsBitField): boolean {
  if (caller.channel.isDMBased()) {
    return true;
  } else {
    let guildPermissions = caller.channel.permissionsFor(caller.client.user);
    return permissions && guildPermissions.has(permissions);
  }
}

/** Responds to a message or interaction
 * options = {edit: false, reply: false, eph: false, follow: false}
 * @param resp A text string or response object to send
 * @param caller The message or interaction objects [oldMsg, newMsg]
 * @param options An options object with response-specific options
 * @return The appropriate message or interaction response function
 */
export async function respond(resp: object | string, caller: Caller[], options: { edit?: boolean; reply?: boolean; eph?: boolean; follow?: boolean; } = {}) {
  let response = typeof(resp) == "string" ? {content: resp} : resp;
  switch(caller[0].gyrType) {
    case "msg": { // respond to command message/channel
      // binary flags, wow!
      let optsFlag = 0;
      if(options.reply && options.reply === true) optsFlag += Math.pow(2, 0);
      if(options.edit && options.edit === true) optsFlag += Math.pow(2, 1);
      // check flags + react accordingly
      switch (optsFlag) {
        case 3:
        case 2: // edit (reply ignored)
          return caller[1].edit(response);
        case 1: // reply
          return caller[1].reply(response);
        default: // default (standard)
          return caller[1].channel.send(response);
      }
    }
    case "slash": { // respond to slash command interaction
      // binary flags, wow!
      let optsFlag = 0;
      if(options.follow && options.follow === true) optsFlag += Math.pow(2, 0);
      if((options.edit && options.edit === true) || caller[0].deferred === true) optsFlag += Math.pow(2, 1);
      response.ephemeral = options.eph ? options.eph : false; // if ephemeral, make it ephemeral
      // check flags + react accordingly
      switch(optsFlag) { // i'm using binary flags, wow!
        case 3:
        case 2: // edit or deferred response (follow ignored)
          return caller[0].editReply(response);
        case 1: // follow
          return caller[0].followUp(response);
        default: // default (reply)
          return caller[0].reply(response);
      }
    }
    default: return undefined; // error
  }
}

/** Generates an rejection embed
 * @param caller Caller that generated the rejection
 * @param title Title of the error embed
 * @param sub Subtitle of the error embed, or `false` if none
 * @param opts Embed options
 * @return Rejection embed
 */
export function genRejectEmbed(msg: Caller, title: string, sub: string | false = false, opts: { col?: ColorResolvable; e?: string | GuildEmoji; } = {}): EmbedBuilder {
  let emoji = (opts.e ? opts.e : exports.getEmoji(msg, GyrominaEmoji.Nope));
  const embed = new EmbedBuilder()
    .setColor(opts.col ? opts.col : resolveEmbedCol(EmbedCol.Rejection))
    .setTitle(`${emoji}  ${title}`);
  if(sub)
    embed.setDescription(`${sub}`);

  return embed;
}
