import { Client, Snowflake, Channel, User, Guild, CommandInteraction } from "discord.js";
import { Caller } from "../command";

export class InteractionCaller implements Caller {
  constructor(private interaction: CommandInteraction) {}
  get applicationID(): Snowflake {
    return this.interaction.applicationId;
  }
  get channel(): Channel | null {
    return this.interaction.channel;
  }
  get channelID(): Snowflake | null {
    return this.interaction.channelId;
  }
  get client(): Client {
    return this.interaction.client;
  }
  get createdAt(): Date {
    return this.interaction.createdAt;
  }
  get createdTimestamp(): number {
    return this.interaction.createdTimestamp;
  }
  get deferred(): boolean {
    return this.interaction.deferred;
  }
  get ephemeral(): boolean | null {
    return this.interaction.ephemeral;
  }
  get guild(): Guild | null {
    return this.interaction.guild;
  }
  get guildID(): Snowflake | null {
    return this.interaction.guildId;
  }
  get id(): Snowflake {
    return this.interaction.id;
  }
  get user(): User {
    return this.interaction.user;
  }
  get webhookID(): Snowflake {
    return this.interaction.webhook.id;
  }
}
