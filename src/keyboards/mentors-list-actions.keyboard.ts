import { Menu } from "@grammyjs/menu";

import { BotContext } from "@bot/types";

export const keyboard = new Menu<BotContext>("mentors-list-action");

keyboard.text({ text: (ctx) => ctx.t("found"), payload: "found" });
keyboard.text({ text: (ctx) => ctx.t("show_more"), payload: "show_more" });

keyboard.row();
