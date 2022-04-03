// import { Menu } from "@grammyjs/menu";

import { InlineKeyboardMarkup } from "@grammyjs/types";

// import { Context } from "@bot/types";

// export const keyboard = new Menu<Context>("mentors_finding_confirmation");

// keyboard.text(
//   (ctx) => ctx.t("show_more"),
//   (ctx) => {
//     console.log("show_more");
//     ctx.callbackQuery.data = "more";
//   }
// );

// keyboard.text(
//   (ctx) => ctx.t("found"),
//   (ctx) => {
//     console.log("found");
//     ctx.callbackQuery.data = "found";
//   }
// );
// keyboard.row();

export const keyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      {
        text: "Показать ещё",
        callback_data: "more",
      },
      {
        text: "Я нашёл",
        callback_data: "found",
      },
    ],
  ],
};
