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

type ReviewState = "commented" | "changes_requested" | "approved";

export default async function onReviewSubmitted(
  props: WebhookEvent<"pull-request-review-submitted">,
  project: Project,
  bot: Bot,
) {
  const { pull_request, repository, review, sender } = props;

  const owner = pull_request.user;
  if (!owner || owner.login === sender.login) {
    return new Response(null, { status: STATUS_CODE.NoContent });
  }

  const ownerDiscordId = project.users.find(
    (user) => user.githubUsername === owner.login,
  )?.discordId;

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

  const state = review.state as ReviewState;

  const title = state === "approved"
    ? "aprovou o PR de"
    : state === "changes_requested"
    ? "pediu alterações no PR de"
    : "comentou no PR de";

  const color = state === "approved"
    ? 0x02c563
    : state === "changes_requested"
    ? 0xda3633
    : 0x383a40;

  await sendMessage(bot, project.discord.pr_channel_id, {
    content: (ownerDiscordId ? ` ${userMention(ownerDiscordId)}` : ""),
    embeds: [{
      thumbnail: {
        url: sender.avatar_url,
      },
      title: `${sender.login} ${title} ${owner.login}`,
      description: `${bold(`(${repository.full_name})`)}
[${bold(`#${pull_request.number} - ${pull_request.title}`)}](${pull_request.html_url}) - ${
        timestamp(seconds, "R")
      }`,
      color,
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
