import { STATUS_CODE } from "@std/http";
import {
  ButtonStyles,
  type DiscordInteraction,
  editMessage,
  editOriginalInteractionResponse,
  InteractionResponseTypes,
  sendInteractionResponse,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import type { AppContext } from "../../../mod.ts";
import { createActionRow, createButton } from "../components.ts";
import { DiscordMessageFlags } from "../types.ts";
import { userMention } from "../textFormatting.ts";

async function execute(
  props: DiscordInteraction,
  _req: Request,
  ctx: AppContext,
) {
  const bot = ctx.discord.bot;
  const { token, id, message } = props;

  if (!message) {
    await sendInteractionResponse(bot, id, token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: "Não foi possível encontrar a mensagem",
        flags: DiscordMessageFlags.Ephemeral,
      },
    });
    return new Response(null, { status: STATUS_CODE.NoContent });
  }

  await sendInteractionResponse(bot, id, token, {
    type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    data: {
      flags: DiscordMessageFlags.Ephemeral,
    },
  });

  await ctx.invoke.workflows.actions.cancel({
    executionId: `review-pr-${message.id}`,
  });

  if (props.channel_id) {
    await editMessage(bot, props.channel_id, message.id, {
      content: props.member?.user?.id
        ? userMention(props.member?.user?.id)
        : "",
      components: [
        createActionRow([
          createButton({
            label: `Revisor: ${props.member?.user?.username}`,
            style: ButtonStyles.Primary,
            disabled: true,
            customId: "noop",
          }),
        ]),
      ],
    });
  }

  await editOriginalInteractionResponse(bot, token, {
    content: "Review confirmado!",
  });

  return new Response(null, { status: STATUS_CODE.NoContent });
}

export default {
  data: createButton({
    label: "Confirmar Review",
    style: ButtonStyles.Primary,
    customId: "confirm_review",
  }),
  execute,
};
