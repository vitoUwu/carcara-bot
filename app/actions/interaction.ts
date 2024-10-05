import { STATUS_CODE } from "@std/http/status";
import {
  type DiscordInteraction,
  InteractionTypes,
  MessageComponentTypes,
  verifySignature,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import type { AppContext } from "../mod.ts";
import buttons from "../sdk/discord/buttons/index.ts";
import ping from "../sdk/discord/commands/ping.ts";
import { ChatInputInteraction } from "../sdk/discord/lib.ts";
import { COMMANDS } from "./updateCommands.ts";

export default function action(
  props: DiscordInteraction,
  req: Request,
  ctx: AppContext,
) {
  if (req.method === "POST") {
    const signature = req.headers.get("x-signature-ed25519") || "";
    const timestamp = req.headers.get("x-signature-timestamp") || "";
    const publicKey = ctx.discord.public_key;
    const rawBody = JSON.stringify(props);

    const { isValid } = verifySignature({
      signature,
      timestamp,
      publicKey,
      body: rawBody,
    });

    if (!isValid) {
      return new Response("Invalid signature", {
        status: STATUS_CODE.Unauthorized,
      });
    }
  }

  if (props.type === InteractionTypes.Ping) {
    return ping();
  }

  if (!props.data) {
    return new Response(null, { status: STATUS_CODE.BadRequest });
  }

  if (props.type === InteractionTypes.ApplicationCommand) {
    const command = COMMANDS.get(props.data.name);

    if (!command) {
      return new Response(null, { status: STATUS_CODE.NotFound });
    }

    return command.execute(
      new ChatInputInteraction(
        props,
        ctx.discord.bot,
      ),
      req,
      ctx,
    ).catch((err) => {
      console.error(err);
      return new Response(null, { status: STATUS_CODE.InternalServerError });
    });
  }

  if (
    props.type === InteractionTypes.MessageComponent &&
    props.data.component_type === MessageComponentTypes.Button &&
    props.data.custom_id
  ) {
    const button = buttons.get(props.data.custom_id);

    if (!button) {
      return new Response(null, { status: STATUS_CODE.NotFound });
    }

    return button.execute(
      props,
      req,
      ctx,
    ).catch((err) => {
      console.error(err);
      return new Response(null, { status: STATUS_CODE.InternalServerError });
    });
  }
}
