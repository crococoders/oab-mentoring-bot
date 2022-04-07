import { Menu } from "@grammyjs/menu";

import { Context } from "@bot/types";

export const keyboard = new Menu<Context>("mentors-list-action");

keyboard.text({ text: (ctx) => ctx.t("found"), payload: "found" });
keyboard.text({ text: (ctx) => ctx.t("show_more"), payload: "show_more" });

keyboard.row();
