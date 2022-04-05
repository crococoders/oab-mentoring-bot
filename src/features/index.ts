import { Context } from "@bot/types";
import { ScenesComposer } from "grammy-scenes";
import { feature as findMentors } from "./find-mentors.feature";
import { feature as registerAsMentor } from "./register-as-mentor.feature";

export { feature as botAdmin } from "./bot-admin.feature";
export { feature as languageSelect } from "./language-select.feature";
export { feature as start } from "./start.feature";

export const scenes = new ScenesComposer<Context>();
scenes.scene(findMentors);
scenes.scene(registerAsMentor);
