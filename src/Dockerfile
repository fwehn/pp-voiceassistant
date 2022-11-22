FROM node:17-alpine

WORKDIR /usr/src
COPY sdk ./sdk
WORKDIR /usr/src/sdk
RUN npm install

WORKDIR /usr/src/app
COPY ["client/package.json", "client/package-lock.json*", "./"]
RUN npm install

COPY client .
VOLUME ["/usr/src/app/skills", "/usr/src/app/configs"]

ENV PORT=12102 \
    LOCALE=de_DE \
    SERVER=localhost:3000 \
    RHASSPY=localhost:12101 \
    MQTTHOST=localhost \
    MQTTPORT=1883 \
    ZIGBEETOPIC=zigbee2mqtt


EXPOSE $PORT
CMD ["node", "index.js"]

