import { BotContext } from "@bot/types";

import { ScenesComposer } from "grammy-scenes";
import { feature as findMentors } from "./find-mentors.feature";
import { feature as fillProfile } from "./fill-profile.feature";
import { feature as editProfile } from "./edit-profile.feature";
import { feature as registerAsMentor } from "./register-as-mentor.feature";

export { feature as botAdmin } from "./bot-admin.feature";
export { feature as languageSelect } from "./language-select.feature";
export { feature as start } from "./start.feature";

export const scenes = new ScenesComposer<BotContext>();
scenes.scene(findMentors);
scenes.scene(registerAsMentor);
scenes.scene(fillProfile);
scenes.scene(editProfile);
