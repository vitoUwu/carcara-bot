import {
  Bot,
  DiscordInteraction,
  InteractionCallbackData,
  InteractionResponse,
  InteractionResponseTypes,
  sendInteractionResponse,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";

export class ChatInputInteraction {
  constructor(
    public readonly interaction: DiscordInteraction,
    public readonly bot: Bot,
  ) {}

  /**
   * Sends a response to an interaction.
   */
  respond(data: InteractionResponse) {
    return sendInteractionResponse(
      this.bot,
      this.interaction.id,
      this.interaction.token,
      data,
    );
  }

  /**
   * Respond to an interaction with a message.
   */
  respondWithMessage(data: InteractionCallbackData) {
    return this.respond({
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data,
    });
  }

  /**
   * ACK an interaction and edit a response later, the user sees a loading state.
   */
  deferRespond(data: InteractionCallbackData) {
    return this.respond({
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
      data,
    });
  }

  getOption<T>(name: string) {
    const option = this.interaction.data?.options?.find((option) =>
      option.name === name
    );

    if (!option) {
      return null;
    }

    return {
      ...option,
      value: option.value as T | undefined,
    };
  }

  getStringOption(name: string) {
    return this.getOption<string>(name);
  }

  getIntegerOption(name: string) {
    return this.getOption<number>(name);
  }
}
