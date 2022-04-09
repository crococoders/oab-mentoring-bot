# OAB Mentoring Bot

Бот, который помогает матчить менторов с менти.

## How to use

1. Clone this repo or generate new repo using this template via [link](https://github.com/bot-base/telegram-bot-template/generate)  

    ```bash
    git clone https://github.com/bot-base/telegram-bot-template
    ```

2. Create development and production environment variables files

    ```bash
    # development
    cp docker-compose.example.bot.env docker-compose.dev.bot.env
    cp docker-compose.example.postgres.env docker-compose.dev.postgres.env

    # production
    cp docker-compose.example.bot.env docker-compose.prod.bot.env
    cp docker-compose.example.postgres.env docker-compose.prod.postgres.env
    ```

3. Edit environment variables in `docker-compose.dev.bot.env` and `docker-compose.prod.bot.env`

    **`BOT_TOKEN`** — bot token, **required to change**. Get it from [@BotFather](https://t.me/BotFather).  
    **`BOT_WEBHOOK`** — bot webhook url, **required to change in production**. Used for setup a webhook in production mode.  
    `BOT_ADMIN_USER_ID` — administrator user ID. Administrator commands, such as `/stats` or `/setcommands`, will only be available to the user with this ID.  

    `NODE_ENV` — environment (default is `development`, set `production` to use webhook)  
    `LOG_LEVEL` — log level  
    `DATABASE_URL` — database url  
    `REDIS_URL` — redis url  

4. Launch bot

    Development mode:

    ```bash
    # install dependencies
    npm i

    # run migrations
    docker-compose run bot npx prisma migrate deploy

    # run bot
    docker-compose up
    ```

    Production mode:

    ```bash
    # run migrations
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml run bot npx prisma migrate deploy

    # run bot
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
    ```
