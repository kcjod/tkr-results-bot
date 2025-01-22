FROM node:16-slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production

RUN apt-get update && apt-get install -y python3 python3-pip \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && pip3 install --no-cache-dir beautifulsoup4 \
    && apt-get clean

COPY . .

ENV NODE_ENV=production

# Make sure to use dynamic port provided by Render
EXPOSE 3000

CMD ["yarn", "start"]
