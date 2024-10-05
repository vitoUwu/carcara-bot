import type { PullRequestEvent, WebhookEvent } from "../../sdk/github/types.ts";

export function isDraft(title: string) {
  return ["[draft]", "(draft)"].some((draft) =>
    title.toLowerCase().includes(draft)
  );
}

export function wasInDraft(
  payload: PullRequestEvent,
): payload is WebhookEvent<"pull-request-edited"> {
  return payload.action === "edited" && !!payload.changes?.title?.from &&
    isDraft(payload.changes.title.from) &&
    !isDraft(payload.pull_request.title);
}
