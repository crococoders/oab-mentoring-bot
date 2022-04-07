import { Context as DefaultContext, SessionFlavor } from "grammy";
import { FluentContextFlavor } from "@grammyjs/fluent";
import { ParseModeContext } from "parse-mode";
import { User } from "@prisma/client";
import { ScenesFlavor, ScenesSessionFlavor } from "grammy-scenes";
import { User as UserDTO } from "./user";

interface UserFlavor {
  user?: User;
}

interface LanguageFlavor {
  languageCode?: string;
}

export type BotContext = DefaultContext &
  FluentContextFlavor &
  ParseModeContext &
  SessionFlavor<ScenesSessionFlavor & LanguageFlavor & UserDTO> &
  UserFlavor &
  ScenesFlavor;
