import { Chat, User } from "@grammyjs/types";
import { BotContext } from "@bot/types";

interface LogMetadata {
  message_id: number | undefined;
  chat: Chat | undefined;
  peer: User | Chat | undefined;
}

export const getPeer = (ctx: BotContext): Chat | User | undefined =>
  ctx.senderChat || ctx.from;

export const getMetadata = (ctx: BotContext): LogMetadata => ({
  message_id: ctx.msg?.message_id,
  chat: ctx.chat,
  peer: getPeer(ctx),
});
