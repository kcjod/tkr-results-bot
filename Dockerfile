FROM node:16-slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production

RUN apt-get update && apt-get install -y python3 python3-pip \
    && pip3 install --no-cache-dir beautifulsoup4 \
    && apt-get clean

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["yarn", "start"]
