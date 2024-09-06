import { STATUS_CODE } from "@std/http/status";
import {
  type DiscordInteraction,
  InteractionTypes,
  verifySignature,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import type { AppContext } from "../mod.ts";
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
}
