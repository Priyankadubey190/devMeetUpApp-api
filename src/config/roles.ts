export class Roles {
  public static readonly allRoles = {
    user: [
      "profile_get",
      "profile_update",
      "swipe",
      "match",
      "chat_send",
      "chat_read",
    ],

    admin: [
      "profile_get",
      "profile_update",
      "swipe",
      "match",
      "chat_send",
      "chat_read",
      "admin_getUsers",
      "admin_manageUsers",
      "admin_deleteUsers",
    ],

    moderator: ["profile_get", "chat_read", "admin_getUsers"],
  } as const;

  public static readonly roles = Object.keys(Roles.allRoles) as Array<
    keyof typeof Roles.allRoles
  >;

  public static readonly roleRights = new Map<
    keyof typeof Roles.allRoles,
    readonly string[]
  >(Object.entries(Roles.allRoles) as any);
}
