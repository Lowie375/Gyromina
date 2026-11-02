import { Message, Snowflake, Client, Guild, User, Channel } from "discord.js";
import { Caller } from "../command";

export class MessageCaller implements Caller {
  constructor(private message: Message) {}
  get applicationID(): Snowflake | null {
    return this.message.applicationId;
  }
  get channel(): Channel {
    return this.message.channel;
  }
  get channelID(): Snowflake {
    return this.message.channelId;
  }
  get client(): Client {
    return this.message.client;
  }
  get createdAt(): Date {
    return this.message.createdAt;
  }
  get createdTimestamp(): number {
    return this.message.createdTimestamp;
  }
  get deferred(): boolean {
    return false;
  }
  get ephemeral(): boolean | null {
    return false;
  }
  get guild(): Guild | null {
    return this.message.guild;
  }
  get guildID(): Snowflake | null {
    return this.message.guildId;
  }
  get id(): Snowflake {
    return this.message.id;
  }
  get user(): User {
    return this.message.author;
  }
  get webhookID(): Snowflake | null {
    return this.message.webhookId;
  }
}