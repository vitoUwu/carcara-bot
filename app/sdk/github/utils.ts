import type { WebhookPullRequestPayload } from "../../types.ts";
import { isWebhookPullRequestEditPayload } from "./validateWebhookPayload.ts";

export function isDraft(title: string) {
  return ["[draft]", "(draft)"].some((draft) =>
    title.toLowerCase().includes(draft)
  );
}

export function wasInDraft(payload: WebhookPullRequestPayload) {
  return isWebhookPullRequestEditPayload(payload) &&
    !!payload.changes?.title?.from &&
    isDraft(payload.changes.title.from) &&
    !isDraft(payload.pull_request.title);
}
