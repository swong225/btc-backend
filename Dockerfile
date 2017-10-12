FROM node:7.7.0-alpine

WORKDIR /home/btc-backend

COPY package.json ./package.json

ADD ./start.sh ./start.sh
RUN chmod 755 ./start.sh

ENTRYPOINT ["/bin/sh", "./start.sh"]
