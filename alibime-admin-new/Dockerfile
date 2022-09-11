FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .
RUN npm install

ENV NODE_ENV=production
ENV SINA_INSURANCE_API_BASE_URL=https://api.alibime.ir/v1

RUN npm run build

CMD [ "npm", "start" ]