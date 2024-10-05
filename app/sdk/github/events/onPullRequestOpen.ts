import { STATUS_CODE } from "@std/http/status";
import { WorkflowProps } from "apps/workflows/actions/start.ts";
import {
  sendMessage,
  snowflakeToBigint,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import type { AppContext, AppManifest, Project } from "../../../mod.ts";
import type { WebhookEvent } from "../../../sdk/github/types.ts";
import confirmReview from "../../discord/buttons/confirmReview.ts";
import { createActionRow } from "../../discord/components.ts";
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

  const owner = pull_request.user;
  const reviewer = getRandomItem(
    project.users.filter((user) => user.githubUsername !== owner.login),
  );
  const reviewers = project.users.filter((user) =>
    user.githubUsername !== owner.login &&
    user.githubUsername !== reviewer?.githubUsername
  );

  const seconds = Math.floor(
    new Date(pull_request.created_at).getTime() / 1000,
  );
  const channelId = project.discord.pr_channel_id;

  const message = await sendMessage(
    bot,
    channelId,
    {
      content: (reviewer ? userMention(reviewer.discordId) : ""),
      embeds: [{
        thumbnail: {
          url: pull_request.user.avatar_url,
        },
        title: `${owner.login} abriu um novo PR`,
        description: `${bold(`(${repository.full_name})`)}
[${bold(`#${pull_request.number} - ${pull_request.title}`)}](${pull_request.html_url}) - ${
          timestamp(seconds, "R")
        }\n\n${pull_request.body || "Sem descrição"}`,
        color: 0x02c563,
        timestamp: new Date(pull_request.created_at).getTime(),
      }],
      components: [
        createActionRow([
          confirmReview.data,
        ]),
      ],
      allowedMentions: {
        users: reviewer ? [snowflakeToBigint(reviewer.discordId)] : [],
      },
    },
  );

  if (reviewer) {
    const messageId = message.id.toString();
    const workflowProps: WorkflowProps<
      "discord-bot/workflows/waitForReviewer.ts",
      AppManifest
    > = {
      key: "discord-bot/workflows/waitForReviewer.ts",
      id: `review-pr-${message.id}`,
      props: {},
      args: [{
        messageId,
        channelId,
        reviewer,
        reviewers,
      }],
    };

    await ctx.invoke.workflows.actions.start(workflowProps);
  }

  return new Response(null, { status: STATUS_CODE.NoContent });
}
