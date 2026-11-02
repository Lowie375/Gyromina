import { ColorResolvable } from "discord.js";
import cdn from "./cdn.json"

export enum EmbedCol {
  Default,
  Hidden,
  Unstable,
  Deprecated,
  Error,
  Warning,
  Accepted,
  Rejection,
  Winter,
  Blurple,
  Crit,
  Failure
};

export enum Season {
  None,
  Pride,
  Winter,
  Blurple
}

/** Returns the current season, if one is active
 * @return The season ID
 */
export function getSeason(): Season {
  // gets the date + time
  let dt = new Date();
  let now = [dt.getUTCSeconds(), dt.getUTCMinutes(), dt.getUTCHours(), dt.getUTCDate(), dt.getUTCMonth(), dt.getUTCFullYear()];
  let season = process.env.season;

  if(season === "-1")
    return Season.None;
  else if(now[4] == 5 || season === "1")
    return Season.Pride;
  else if(now[4] == 11 || season === "2")
    return Season.Winter;
  else if((now[4] == 4 && now[3] >= 9 && now[3] <= 15) || season === "3")
    return Season.Blurple;
  else
    return Season.None;
}

/** Converts an embed colour to a valid colour that discord.js can process
 * @param col The embed colour to resolve
 * @return The resolved embed colour
 */
export function resolveEmbedCol(col: EmbedCol): ColorResolvable {
  switch(col) {
    case EmbedCol.Default: return "#00b275";
    case EmbedCol.Hidden: return "#fefefe";
    case EmbedCol.Unstable: return "#ffcc4d";
    case EmbedCol.Deprecated: return "#ff4d4d";
    case EmbedCol.Error: return "#ffcc4d";
    case EmbedCol.Warning: return "#ffcc4d";
    case EmbedCol.Accepted: return "#1cff20";
    case EmbedCol.Rejection: return "#ff4d4d";
    case EmbedCol.Winter: return "#7289da";
    case EmbedCol.Blurple: return "#5865f2";
    case EmbedCol.Crit: return "#1cff20";
    case EmbedCol.Failure: return "#ff4d4d";
  }
}

/** Converts an embed colour to a valid colour that discord.js can process, replacing it with a seasonal colour if appropriate 
 * @param col The embed colour to resolve
 * @return The embed colour to use
 */
export function resolveSeasonalEmbedCol(col: EmbedCol): ColorResolvable {
  let s = getSeason();

  switch(s) {
    case Season.Pride: {
      let prideCol = Math.min(Math.floor(Math.random() * 193) + 63, 255);
      let pos = [Math.min(Math.floor(Math.random()*3), 2), Math.min(Math.floor(Math.random()*2), 1)];
      if(pos[1] === 0) { // 255 before 63
        switch(pos[0]) {
          case 0: return `#${prideCol.toString(16)}ff3f`;
          case 1: return `#ff${prideCol.toString(16)}3f`;
          case 2: return `#ff3f${prideCol.toString(16)}`;
          default: return resolveEmbedCol(col);
        }
      } else if(pos[1] === 1) { // 63 before 255
        switch(pos[0]) {
          case 0: return `#${prideCol.toString(16)}3fff`;
          case 1: return `#3f${prideCol.toString(16)}ff`;
          case 2: return `#3fff${prideCol.toString(16)}`;
          default: return resolveEmbedCol(col);
        }
      } else {
        return resolveEmbedCol(col);
      }
    }
    case Season.Winter:
      return resolveEmbedCol(EmbedCol.Winter);
    case Season.Blurple:
      return resolveEmbedCol(EmbedCol.Blurple);
    default:
      return resolveEmbedCol(col);
  }
}

/** Checks whether an avatar should be changed due to the current season
 * @return The avatar image to use
 */
export function getAvatar(): string {
  switch(getSeason()) {
    case Season.Pride:
      return cdn.avatar.pride;
    case Season.Winter:
      return cdn.avatar.winter;
    case Season.Blurple:
      return cdn.avatar.blurple;
    default:
      return cdn.avatar.default;
  }
}

/** Creates a custom date timestamp for embed usage
 * @return The produced timestanp
 */
export function getTimestamp(): string {
  let dt = new Date();
  let rawNow = [dt.getUTCSeconds(), dt.getUTCMinutes(), dt.getUTCHours(), dt.getUTCDate(), dt.getUTCMonth()+1, dt.getUTCFullYear()];
  let now = rawNow.map(elem => elem.toString().padStart(2, '0'));
  return `${now[5]}-${now[4]}-${now[3]} @ ${now[2]}:${now[1]} UTC`;
}
