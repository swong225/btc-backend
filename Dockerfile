FROM node:7.7.0-alpine

WORKDIR /home/btc-backend

COPY public ./public
COPY bin ./bin
COPY routes ./routes
COPY app.js ./app.js
COPY package.json ./package.json

CMD npm install && npm start
