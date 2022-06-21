FROM node:16-alpine

# working Dir
WORKDIR /usr/src/app

# Copy Package Json Files
COPY package.json .
COPY yarn.lock .

# install files
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8080

# CMD ["node", "dist/index.js"]