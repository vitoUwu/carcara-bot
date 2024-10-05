import { STATUS_CODE } from "@std/http/status";
import {
  type Bot,
  ButtonStyles,
  sendMessage,
  snowflakeToBigint,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import type { AppContext, Project } from "../../../mod.ts";
import type { WebhookEvent } from "../../../sdk/github/types.ts";
import { createActionRow, createButton } from "../../discord/components.ts";
import { bold, timestamp, userMention } from "../../discord/textFormatting.ts";
import { getRandomItem } from "../../random.ts";
import { isDraft } from "../utils.ts";

export default async function onPullRequestOpen(
  props: WebhookEvent<"pull-request-opened" | "pull-request-edited">,
  project: Project,
  ctx: AppContext,
) {
  const bot = ctx.discord.bot;
  const { pull_request, repository } = props;
  if (isDraft(pull_request.title)) {
    return new Response(null, { status: STATUS_CODE.NoContent });
  }

  const owner = pull_request.user.login;
  const theChosenOne = getRandomItem(
    project.users.filter((user) => user.githubUsername !== owner),
  );
  const viewOnGithubRow = createActionRow([
    createButton({
      label: "Ver no GitHub",
      url: pull_request.html_url,
      style: ButtonStyles.Link,
    }),
  ]);

  const seconds = Math.floor(
    new Date(pull_request.created_at).getTime() / 1000,
  );

  await sendMessage(bot, project.discord.pr_channel_id, {
    content: (theChosenOne ? ` ${userMention(theChosenOne.discordId)}` : ""),
    embeds: [{
      thumbnail: {
        url: pull_request.user.avatar_url,
      },
      title: `${owner} abriu um novo PR`,
      description: `${bold(`(${repository.full_name})`)}
[${bold(`#${pull_request.number} - ${pull_request.title}`)}](${pull_request.html_url}) - ${
        timestamp(seconds, "R")
      }\n\n${pull_request.body || "Sem descrição"}`,
      color: 0x02c563,
      timestamp: new Date(pull_request.created_at).getTime(),
    }],
    components: [viewOnGithubRow],
    allowedMentions: {
      users: theChosenOne ? [snowflakeToBigint(theChosenOne.discordId)] : [],
    },
  });

  return new Response(null, { status: STATUS_CODE.NoContent });
}
