import fastify from "fastify";
// import gracefulShutdown from "fastify-graceful-shutdown";
import { BotError, webhookCallback } from "grammy";
import { register } from "prom-client";

import { bot } from "@bot/bot";
import { config } from "@bot/config";
import { logger } from "@bot/logger";
import { handleError } from "@bot/helpers/error-handler";
// import { handleGracefulShutdown } from "@bot/helpers/graceful-shutdown-handler";

export const server = fastify({
  logger,
});

// server.register(gracefulShutdown).after(() => {
//   server.gracefulShutdown(async (signal, next) => {
//     await handleGracefulShutdown();
//     next();
//   });
// });

server.setErrorHandler(async (error, request, response) => {
  if (error instanceof BotError) {
    await handleError(error);

    response.code(200).send({});
  } else {
    logger.error(error);

    response.status(500).send({ error: "Something went wrong" });
  }
});

server.post(`/${config.BOT_TOKEN}`, webhookCallback(bot, "fastify"));

server.get("/metrics", async (req, res) => {
  try {
    res.header("Content-Type", register.contentType);
    res.send(await register.metrics());
  } catch (err) {
    res.status(500).send(err);
  }
});
