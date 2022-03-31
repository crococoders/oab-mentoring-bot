import { NextFunction } from "grammy";

import { middlewareContext } from "@bot/context";
import { Context } from "@bot/types";

export const middleware = () => (ctx: Context, next: NextFunction) => {
  const store = new Map();
  return middlewareContext.run(store, next);
};
