import { Channel, Client, CommandInteractionOptionResolver, Guild, Snowflake, User } from "discord.js";

export interface Command {
  execute(context: CommandContext): void;
  extractInteractionArgs(options: CommandInteractionOptionResolver): CommandArguments;
  extractMessageArgs(args: MessageArguments): CommandArguments;
  get info(): CommandInfo;
};

export type MessageArguments = {
  raw: string[],
  clean: string[]
}

export type CommandArguments = Map<string, any>;

export type CommandContext = {
  args: CommandArguments,
  client: Client,
  caller: Caller
};

export type CommandInfo = {
  name: string,
  description: string,
  params: CommandParameter[],
  type: CommandType,
  slashCompatible: boolean,
  messageAliases?: string[],
  helpURL?: string,
  helpWeight?: number
};

export enum CommandType {
  Stable,
  Unstable,
  Hidden,
  Deprecated
};

export type CommandParameter = {
  id: string,
  optional: boolean
};

export interface Caller {
  get applicationID(): Snowflake | null,
  get channel(): Channel | null,
  get channelID(): Snowflake | null,
  get client(): Client,
  get createdAt(): Date,
  get createdTimestamp(): number,
  get deferred(): boolean
  get ephemeral(): boolean | null,
  get guild(): Guild | null,
  get guildID(): Snowflake | null,
  get id(): Snowflake,
  get user(): User,
  get webhookID(): Snowflake | null,

  // awaitModalSubmit(),
  // deferReply(),
  // deleteReply(),
  // editReply(),
  // fetchReply(),
  // followUp(),
  // inCachedGuild(),
  // inGuild(),
  // inRawGuild(),
  // isAnySelectMenu(),
  // isAutocomplete(),
  // isButton(),
  // isChannelSelectMenu(),
  // isChatInputCommand(),
  // isCommand(),
  // isContextMenuCommand(),
  // isMentionableSelectMenu(),
  // isMessageComponent(),
  // isMessageContextMenuCommand(),
  // isModalSubmit(),
  // isPrimaryEntryPointCommand(),
  // isRepliable(),
  // isRoleSelectMenu(),
  // isSelectMenu(),
  // isStringSelectMenu(),
  // isUserContextMenuCommand(),
  // isUserSelectMenu(),
  // launchActivity(),
  // reply(),
  // showModal(),
  // toJSON(),
  // valueOf(),
}
