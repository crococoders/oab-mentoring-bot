import { InlineKeyboardMarkup } from "@grammyjs/types";

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
