"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
class Roles {
}
exports.Roles = Roles;
Roles.allRoles = {
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
};
Roles.roles = Object.keys(Roles.allRoles);
Roles.roleRights = new Map(Object.entries(Roles.allRoles));
