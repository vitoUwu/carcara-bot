import type { EventKeys, WebhookEvent } from "../../types.ts";

export function isWebhookEvent<TEventName extends EventKeys = EventKeys>(
  props: unknown,
): props is WebhookEvent<TEventName> {
  return (
    typeof props === "object" &&
    props !== null &&
    !Array.isArray(props) &&
    "action" in props &&
    typeof props.action === "string"
  );
}

enum Events {
  Ping = "ping",
  PullRequest = "pull_request",
  PullRequestReview = "pull_request_review",
}

export function isPingEvent(
  event: string,
  props: unknown,
): props is WebhookEvent<"ping"> {
  return event === Events.Ping && isWebhookEvent<"ping">(props);
}

export function isPullRequestEvent(
  event: string,
  props: unknown,
): props is WebhookEvent<
  | "pull-request-opened"
  | "pull-request-closed"
  | "pull-request-edited"
> {
  return (
    event === Events.PullRequest &&
    isWebhookEvent<
      | "pull-request-opened"
      | "pull-request-closed"
      | "pull-request-edited"
    >(props)
  );
}

export function isPullRequestReviewEvent(
  event: string,
  props: unknown,
): props is WebhookEvent<
  | "pull-request-review-submitted"
  | "pull-request-review-edited"
  | "pull-request-review-dismissed"
  | "pull-request-review-requested"
> {
  return (
    event === Events.PullRequestReview &&
    isWebhookEvent<
      | "pull-request-review-submitted"
      | "pull-request-review-edited"
      | "pull-request-review-dismissed"
      | "pull-request-review-requested"
    >(props)
  );
}
