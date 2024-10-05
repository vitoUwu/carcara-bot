import { STATUS_CODE } from "@std/http/status";
import {
  upsertGlobalApplicationCommands,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import type { AppContext } from "../mod.ts";
import commands from "../sdk/discord/commands/index.ts";

export default async function action(
  _props: unknown,
  _req: unknown,
  ctx: AppContext,
) {
  try {
    await upsertGlobalApplicationCommands(
      ctx.discord.bot,
      [...commands.values()].map((command) => command.data),
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      {
        status: STATUS_CODE.InternalServerError,
      },
    );
  }

  return new Response(null, { status: STATUS_CODE.NoContent });
}
