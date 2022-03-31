import { Menu } from "@grammyjs/menu";

import { Context, specializations } from "@bot/types";

export const keyboard = new Menu<Context>("specialization");

for (let index = 0; index < specializations.length; index += 1) {
  keyboard.text(
    {
      text: specializations[index].name,
    },
    async (ctx, next) => {
      next();
    }
  );

  keyboard.row();
}

specializations.map((item) => keyboard.text(item.name));
