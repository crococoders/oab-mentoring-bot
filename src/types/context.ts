import { Context as DefaultContext, SessionFlavor } from "grammy";
import { FluentContextFlavor } from "@grammyjs/fluent";
import { ParseModeContext } from "parse-mode";
import { User } from "@prisma/client";

import { SessionData } from "./session";
import { MentorData } from "./mentor";

interface UserFlavor {
  user?: User;
}

type MentorsFlavor = Array<MentorData>;

export type Context = DefaultContext &
  FluentContextFlavor &
  ParseModeContext &
  SessionFlavor<SessionData> &
  UserFlavor &
  MentorsFlavor;
