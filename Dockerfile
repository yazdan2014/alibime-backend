FROM node:12

WORKDIR /usr/src/app

#COPY package*.json ./
COPY package.json ./
COPY . .

RUN chmod +x ./clean.sh
RUN ./clean.sh
RUN npm install

RUN mkdir /usr/src/logs
RUN mkdir /usr/src/images
RUN cd /usr/src/images && mkdir orderImages

ENV NODE_ENV=production
ENV ALIBIME_IMAGE_PATH=/usr/src/images
ENV ALIBIME_LOG_PATH=/usr/src/logs

#USER node

EXPOSE 4000

CMD [ "node", "app.js" ]
