import { type WorkflowContext, WorkflowGen } from "deco/mod.ts";
// import type { Props as SendReviewerMessageProps } from "../actions/discord/sendReviewerMessage.ts";
import { type AppManifest } from "../mod.ts";

export default function Index() {
  return function* (
    ctx: WorkflowContext<AppManifest>,
    // props: SendReviewerMessageProps,
  ): WorkflowGen<void> {
    yield ctx.log("Waiting for reviewer");

    // wait 5 minutes and send message
    yield ctx.sleep(5 * 60 * 1000);
    // yield ctx.invoke(
    //   "discord-bot/actions/discord/sendReviewerMessage.ts",
    //   props,
    // );

    yield ctx.log("Reviewer message sent");
  };
}
