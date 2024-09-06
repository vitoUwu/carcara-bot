import { STATUS_CODE } from "@std/http/status";
import type { AppContext } from "../mod.ts";
import onPullRequestMerge from "../sdk/github/onPullRequestMerge.ts";
import onPullRequestOpen from "../sdk/github/onPullRequestOpen.ts";
import { wasInDraft } from "../sdk/github/utils.ts";
import {
  isWebhookPingPayload,
  isWebhookPullRequestPayload,
} from "../sdk/github/validateWebhookPayload.ts";
import { verify } from "../sdk/github/verifyWebhook.ts";
import type { WebhookPullRequestPayload } from "../types.ts";

export default async function action(
  props: WebhookPullRequestPayload | unknown,
  req: Request,
  ctx: AppContext,
) {
  const signature = req.headers.get("x-hub-signature-256");

  if (!signature) {
    console.error("Signature is missing. Request Headers:", req.headers);
    return new Response("Signature is missing", {
      status: STATUS_CODE.Unauthorized,
    });
  }

  if (isWebhookPingPayload(props)) {
    return new Response(null, { status: 200 });
  }

  if (!isWebhookPullRequestPayload(props)) {
    console.error("Invalid payload. Request Body:", props);
    return new Response("Invalid payload", { status: STATUS_CODE.BadRequest });
  }

  const project = ctx.projects.find(({ github }) =>
    `${github.org_name}/${github.repo_name}` === props.repository.full_name
  );
  if (!project) {
    console.error("Unknown repository. Request Body:", props);
    return new Response("Unknown repository", {
      status: STATUS_CODE.BadRequest,
    });
  }

  if (!project.active) {
    console.error("Project is not active. Data:", { project, props });
    return new Response("Project is not active", {
      status: STATUS_CODE.ServiceUnavailable,
    });
  }

  const secret = project.github.webhook_secret.get();
  if (!secret) {
    console.error("Secret is missing. Data:", { project, props });
    return new Response("Secret is missing", {
      status: STATUS_CODE.BadRequest,
    });
  }

  if (!(await verify(secret, JSON.stringify(props), signature))) {
    console.error("Invalid signature. Data:", { project, props });
    return new Response("Invalid signature", {
      status: STATUS_CODE.Unauthorized,
    });
  }

  if (props.action === "opened" || wasInDraft(props)) {
    return onPullRequestOpen(props, project, ctx.discord.bot);
  } else if (props.action === "closed" && props.pull_request.merged) {
    return onPullRequestMerge(props, project, ctx.discord.bot);
  }

  return new Response(null, { status: 200 });
}
