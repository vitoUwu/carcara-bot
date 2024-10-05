import {
  ApplicationCommandTypes,
  type DiscordCreateApplicationCommand,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import type { AppContext } from "../../../mod.ts";
import clickMe from "../buttons/confirmReview.ts";
import { createActionRow } from "../components.ts";
import type { ChatInputInteraction } from "../lib.ts";

const data: DiscordCreateApplicationCommand = {
  name: "debug",
  description: "debug",
  type: ApplicationCommandTypes.ChatInput,
  dm_permission: false,
};

async function execute(
  interaction: ChatInputInteraction,
  _req: Request,
  _ctx: AppContext,
) {
  const row = createActionRow([
    clickMe.data,
  ]);

  return await interaction.respondWithMessage({
    content: "Hello",
    components: [row],
  });
}

export default {
  data,
  execute,
};
