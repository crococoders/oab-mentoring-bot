import { Menu } from "@grammyjs/menu";

import { BotContext } from "@bot/types";
import { Availability } from "@prisma/client";
import { updateAvailability } from "@bot/services/users.service";

export const keyboard = new Menu<BotContext>("set-availability-action");

const availabilities = [
  { key: Availability.AVAILABLE, name: "mentor_available", icon: "✅" },
  { key: Availability.UNAVAILABLE, name: "mentor_unavailable", icon: "❌" },
];

for (let index = 0; index < availabilities.length; index += 1) {
  keyboard.text(
    (ctx) => {
      return `${
        ctx.session.availability === availabilities[index].key
          ? availabilities[index].icon
          : ""
      } ${ctx.t(availabilities[index].name)}`;
    },
    async (ctx) => {
      try {
        const telegramId = ctx.from!.id.toString();
        const updatedUser = await updateAvailability(
          telegramId,
          availabilities[index].key
        );
        ctx.session.availability = updatedUser.availability;

        await ctx.editMessageText(ctx.t("change_availability.success"), {
          reply_markup: keyboard,
        });
      } catch (e) {
        console.log(e);
        await ctx.editMessageText(ctx.t("change_availability.fail"), {
          reply_markup: keyboard,
        });
      }
    }
  );
}

keyboard.row();
