FROM node:20.11-alpine

RUN mkdir -p home/node/app

WORKDIR /home/node/app

COPY ./package*.json ./

RUN apk add --no-cache git

COPY . /home/node/app/

RUN npm install

EXPOSE 3333

USER node

ENTRYPOINT [ "npm", "run", "start:dev" ]