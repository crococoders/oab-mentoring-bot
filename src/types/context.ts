import { Context as DefaultContext, SessionFlavor } from "grammy";
import { FluentContextFlavor } from "@grammyjs/fluent";
import { ParseModeContext } from "parse-mode";
import { User } from "@prisma/client";
import { SessionState } from "./session";

interface UserFlavor {
  user?: User;
}

export type Context = DefaultContext &
  FluentContextFlavor &
  ParseModeContext &
  SessionFlavor<SessionState> &
  UserFlavor;
