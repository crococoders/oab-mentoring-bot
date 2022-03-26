FROM node:16

WORKDIR /usr/app

COPY package*.json ./
COPY . /usr/app

RUN npm install
RUN npm install -g nodemon

CMD [ "nodemon", "/usr/app/src/index.ts" ]