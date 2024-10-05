import type { WorkflowContext, WorkflowGen } from "deco/mod.ts";
import type { Props as NotifyReviewerProps } from "../actions/notify/reviewer.ts";
import type { AppManifest } from "../mod.ts";
import { getRandomItem } from "../sdk/random.ts";
import type { ProjectUser } from "../types.ts";

const DELAY = 1000 * 60 * 5;

interface Props extends NotifyReviewerProps {
  reviewers: ProjectUser[];
}

export default function workflow() {
  return function* (
    ctx: WorkflowContext<AppManifest>,
    args: Omit<Props, "messageId">,
  ): WorkflowGen<void> {
    let reviewer = args.reviewer;
    let reviewers = args.reviewers.filter((user) =>
      user.githubUsername !== reviewer.githubUsername
    );

    while (reviewer) {
      yield ctx.log(
        `Waiting for reviewer. ${reviewer.githubUsername}`,
      );
      yield ctx.log(
        `Reviewers in wait list: ${
          reviewers.map((user) => user.githubUsername)
        }`,
      );

      yield ctx.sleep(DELAY);

      const actionProps = {
        channelId: args.channelId,
        reviewer,
      };

      yield ctx.callLocalActivity(async () => {
        return await ctx.state.invoke["discord-bot"].actions.notify.reviewer(
          actionProps,
        );
      });

      yield ctx.sleep(DELAY * 3);

      yield ctx.callLocalActivity(async () => {
        return await ctx.state.invoke["discord-bot"].actions.notify.reviewer(
          actionProps,
        );
      });

      const { newReviewer, newReviewers } = yield ctx.callLocalActivity(() => {
        const newReviewer = getRandomItem(reviewers);
        const newReviewers = reviewers.filter((user) =>
          user.githubUsername !== newReviewer.githubUsername
        );
        return { newReviewer, newReviewers };
      });

      reviewer = newReviewer;
      reviewers = newReviewers;
    }
  };
}
