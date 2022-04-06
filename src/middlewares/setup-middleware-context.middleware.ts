import { NextFunction } from "grammy";

import { middlewareContext } from "@bot/context";
import { BotContext } from "@bot/types";

export const middleware = () => (ctx: BotContext, next: NextFunction) => {
  const store = new Map();
  return middlewareContext.run(store, next);
};
