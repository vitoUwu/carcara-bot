import { STATUS_CODE } from "@std/http/status";
import {
  Bot,
  ButtonStyles,
  sendMessage,
  snowflakeToBigint,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { Project } from "../../../mod.ts";
import { WebhookEvent } from "../../../types.ts";
import { createActionRow, createButton } from "../../discord/components.ts";
import { bold, timestamp, userMention } from "../../discord/textFormatting.ts";

export default async function onReviewRequested(
  props: WebhookEvent<"pull-request-review-requested">,
  project: Project,
  bot: Bot,
) {
  const { pull_request, repository, requested_reviewer, sender } = props;

  const viewOnGithubRow = createActionRow([
    createButton({
      label: "Ver no Github",
      url: pull_request.html_url,
      style: ButtonStyles.Link,
    }),
  ]);

  const seconds = Math.floor(
    new Date(pull_request.created_at).getTime() / 1000,
  );

  const requestedReviewerDiscordId = project.users.find(
    (user) => user.githubUsername === requested_reviewer?.login,
  )?.discordId;

  await sendMessage(bot, project.discord.pr_channel_id, {
    content: requestedReviewerDiscordId
      ? userMention(requestedReviewerDiscordId)
      : "",
    embeds: [{
      thumbnail: {
        url: sender.avatar_url,
      },
      title: `${sender.login} pediu para ${
        requested_reviewer?.login || "alguém"
      } revisar um PR`,
      description: `${bold(`(${repository.full_name})`)}
[${bold(`#${pull_request.number} - ${pull_request.title}`)}](${pull_request.html_url}) - ${
        timestamp(seconds, "R")
      }`,
      timestamp: new Date().getTime(),
    }],
    components: [viewOnGithubRow],
    allowedMentions: {
      users: requestedReviewerDiscordId
        ? [snowflakeToBigint(requestedReviewerDiscordId)]
        : [],
    },
  });

  return new Response(null, { status: STATUS_CODE.NoContent });
}
