import { STATUS_CODE } from "@std/http/status";
import { Project } from "app/mod.ts";
import { createActionRow, createButton } from "app/sdk/discord/components.ts";
import {
  bold,
  timestamp,
  userMention,
} from "app/sdk/discord/textFormatting.ts";
import { WebhookEvent } from "app/types.ts";
import {
  Bot,
  ButtonStyles,
  sendMessage,
  snowflakeToBigint,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";

export default async function onReviewSubmitted(
  props: WebhookEvent<"pull-request-review-submitted">,
  project: Project,
  bot: Bot,
) {
  const { pull_request, repository, review } = props;

  const owner = pull_request.user;
  if (!owner) {
    return new Response(null, { status: STATUS_CODE.NoContent });
  }

  const ownerDiscordId = project.users.find(
    (user) => user.githubUsername === owner.login,
  )?.discordId;

  const reviewer = review.user;

  const viewOnGithubRow = createActionRow([
    createButton({
      label: "Ver revisão",
      url: review.html_url,
      style: ButtonStyles.Link,
    }),
  ]);

  const seconds = Math.floor(
    new Date(pull_request.created_at).getTime() / 1000,
  );

  await sendMessage(bot, project.discord.pr_channel_id, {
    content: (ownerDiscordId ? ` ${userMention(ownerDiscordId)}` : ""),
    embeds: [{
      ...(reviewer?.avatar_url && {
        thumbnail: {
          url: reviewer.avatar_url,
        },
      }),
      title: `👀 ${reviewer?.login || "Alguém"} revisou o PR de ${owner.login}`,
      description: `${bold(`(${repository.full_name})`)}
[${bold(`#${pull_request.number} - ${pull_request.title}`)}](${pull_request.html_url}) - ${
        timestamp(seconds, "R")
      }`,
      color: 0x02c563,
      timestamp: review.submitted_at
        ? new Date(review.submitted_at).getTime()
        : new Date().getTime(),
    }],
    components: [viewOnGithubRow],
    allowedMentions: {
      users: ownerDiscordId ? [snowflakeToBigint(ownerDiscordId)] : [],
    },
  });

  return new Response(null, { status: STATUS_CODE.NoContent });
}
