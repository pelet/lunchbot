FROM node:8-alpine

WORKDIR /lunchbot

COPY package*.json ./

RUN npm install

ADD . ./

RUN npm install

CMD ["npm", "start"]
