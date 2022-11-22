FROM node:17-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
VOLUME ["/usr/src/app/skills", "/usr/src/app/configs"]

ENV PORT=3000

EXPOSE $PORT
CMD ["node", "index.js"]