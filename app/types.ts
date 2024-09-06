import type { DiscordCreateApplicationCommand } from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import type { AppContext } from "./mod.ts";
import type { ChatInputInteraction } from "./sdk/discord/lib.ts";

export interface PullRequestBase {
  label: string;
  ref: string;
  sha: string;
  user: User;
  repo: Repository;
}

export interface Link {
  href: string;
}

export interface Links {
  self: Link;
  html: Link;
  issue: Link;
  comments: Link;
  review_comments: Link;
  review_comment: Link;
  commits: Link;
  statuses: Link;
}

interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  description: string | null;
  color: string;
  default: boolean;
}

interface Milestone {
  url: string;
  html_url: string;
  labels_url: string;
  id: number;
  node_id: string;
  number: number;
  state: "open" | "closed";
  title: string;
  description: string | null;
  creator: User;
  open_issues: number;
  closed_issues: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  due_on: string | null;
}

interface AutoMerge {
  enabled_by: User;
  merge_method: "merge" | "squash" | "rebase";
  commit_title: string;
  commit_message: string;
}

interface Hook {
  type: string;
  id: number;
  name: string;
  active: boolean;
  events: string[];
  config: {
    content_type: string;
    insecure_ssl: string;
    secret: string;
    url: string;
  };
  updated_at: string;
  created_at: string;
  url: string;
  test_url: string;
  ping_url: string;
  deliveries_url: string;
  last_response: {
    code: string | null;
    status: string;
    message: string | null;
  };
}

export interface PullRequest {
  url: string;
  id: number;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  number: number;
  state: "open" | "closed";
  locked: boolean;
  title: string;
  user: User;
  body: string | null;
  labels: Label[];
  milestone?: Milestone | null;
  active_lock_reason: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string | null;
  assignee: User | null;
  assignees?: User[] | null;
  requested_reviewers?: User[] | null;
  head: PullRequestBase;
  base: PullRequestBase;
  _links: Links;
  author_association:
    | "COLLABORATOR"
    | "CONTRIBUTOR"
    | "FIRST_TIMER"
    | "FIRST_TIME_CONTRIBUTOR"
    | "MANNEQUIN"
    | "MEMBER"
    | "NONE"
    | "OWNER";
  auto_merge: AutoMerge | null;
  draft?: boolean;
  merged?: boolean;
  mergeable?: boolean | null;
  mergeable_state?: string;
  merged_by?: User | null;
  comments?: number;
  review_comments?: number;
  maintainer_can_modify?: boolean;
  commits?: number;
  additions?: number;
  deletions?: number;
  changed_files?: number;
  allow_auto_merge?: boolean;
  allow_update_branch?: boolean;
  delete_branch_on_merge?: boolean;
  merge_commit_message?: "PR_BODY" | "PR_TITLE" | "BLANK";
  merge_commit_title?: "PR_TITLE" | "MERGE_MESSAGE";
  squash_merge_commit_message?: "PR_BODY" | "COMMIT_MESSAGES" | "BLANK";
  squash_merge_commit_title?: "PR_TITLE" | "COMMIT_OR_PR_TITLE";
  use_squash_pr_title_as_default?: boolean;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: User;
  private: boolean;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url: string | null;
  open_issues_count: number;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}

export interface User {
  name?: string | null;
  email?: string | null;
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  starred_at?: string;
}

export interface WebhookPullRequestPayload {
  action:
    | "assigned"
    | "auto_merge_disabled"
    | "auto_merge_enabled"
    | "closed"
    | "converted_to_draft"
    | "demilestoned"
    | "dequeued"
    | "edited"
    | "enqueued"
    | "labeled"
    | "locked"
    | "milestoned"
    | "opened"
    | "ready_for_review"
    | "reopened"
    | "review_request_removed"
    | "review_requested"
    | "synchronize"
    | "unassigned"
    | "unlabeled"
    | "unlocked";
  number: number;
  pull_request: PullRequest;
  repository: Repository;
  sender: User;
}

export interface WebhookPullRequestEditPayload
  extends WebhookPullRequestPayload {
  action: "edited";
  changes: {
    base?: {
      ref: {
        from: string;
      };
      sha: {
        from: string;
      };
    };
    body?: {
      from: string;
    };
    title?: {
      from: string;
    };
  };
}

export interface WebhookPingPayload {
  zen: string;
  hook_id: number;
  hook: Hook;
  repository: Repository;
  sender: User;
}

export type Execute = (
  interaction: ChatInputInteraction,
  req: Request,
  ctx: AppContext,
) => Promise<unknown>;

export interface Command {
  data: DiscordCreateApplicationCommand;
  execute: Execute;
}

/**
 * @title {{githubUsername}} ({{discordId}})
 */
export interface ProjectUser {
  discordId: string;
  githubUsername: string;
}
