import { Context as DefaultContext, SessionFlavor } from "grammy";
import { FluentContextFlavor } from "@grammyjs/fluent";
import { ParseModeContext } from "parse-mode";
import { Availability, User } from "@prisma/client";
import { ScenesFlavor, ScenesSessionFlavor } from "grammy-scenes";

interface UserFlavor {
  user?: User;
}

interface LanguageFlavor {
  languageCode?: string;
}

interface AvailabilityFlavor {
  availability?: Availability | null;
}

export type BotContext = DefaultContext &
  FluentContextFlavor &
  ParseModeContext &
  SessionFlavor<
    ScenesSessionFlavor & LanguageFlavor & UserFlavor & AvailabilityFlavor
  > &
  UserFlavor &
  ScenesFlavor;
