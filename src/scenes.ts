import { Context } from "@bot/types";
import { ScenesComposer } from "grammy-scenes";
import { findMentorsScene } from "./features";

export const scenes = new ScenesComposer<Context>();
scenes.scene(findMentorsScene);
