FROM node:7.7.0-alpine

WORKDIR /home/btc-backend

COPY package.json ./package.json

CMD npm install && npm start
