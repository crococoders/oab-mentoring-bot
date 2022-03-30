import { Menu } from "@grammyjs/menu";

import { Context, specializations } from "@bot/types";

export const keyboard = new Menu<Context>("specialization");

keyboard.text(
  {
    text: "я нашел",
  },
  async (ctx, next) => {
    next();
  }
);
keyboard.row();

// specializations.map((item) => keyboard.text(item.name));
