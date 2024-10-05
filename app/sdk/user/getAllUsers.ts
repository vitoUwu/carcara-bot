import { isResolvable } from "deco/mod.ts";
import type { AppContext } from "../../mod.ts";
import type { ProjectUser } from "../../types.ts";

const USER_RESOLVE_TYPE = "discord-bot/loaders/user.ts";

interface UserResolvable {
  __resolveType: typeof USER_RESOLVE_TYPE;
  user: ProjectUser;
}

export default async function getAllUsers(ctx: AppContext) {
  const resolvables = await ctx.get<Record<string, UserResolvable>>({
    __resolveType: "resolvables",
  });

  const users = Object
    .values(resolvables)
    .filter((value) =>
      isResolvable(value) &&
      value.__resolveType === USER_RESOLVE_TYPE &&
      value.user?.githubUsername &&
      value.user?.discordId
    )
    .map(({ user }) => user);

  return users;
}
