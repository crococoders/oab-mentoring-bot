import { Context as DefaultContext, SessionFlavor } from "grammy";
import { FluentContextFlavor } from "@grammyjs/fluent";
import { ParseModeContext } from "parse-mode";
import { User } from "@prisma/client";
import { ScenesFlavor, ScenesSessionFlavor } from "grammy-scenes";
import { SessionState } from "./session";
import { User as UserDTO } from "./user";

interface UserFlavor {
  user?: User;
}

export type Context = DefaultContext &
  FluentContextFlavor &
  ParseModeContext &
  SessionFlavor<ScenesSessionFlavor & SessionState & UserDTO> &
  UserFlavor &
  ScenesFlavor;
