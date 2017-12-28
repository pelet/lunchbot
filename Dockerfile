FROM node:8-alpine

WORKDIR /lunchbot

ADD . ./

RUN npm install

CMD ["npm", "start"]
