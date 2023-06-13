FROM --platform=$BUILDPLATFORM docker.tangerie.xyz/node-docker AS build

WORKDIR /app

COPY package*.json ./

RUN NODE_ENV=development npm i

COPY . .

RUN npm run build

FROM node:18.3.0

ARG OAUTH_CLIENT_SECRET
ENV OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY .env .env
COPY tsconfig.json tsconfig.json
COPY --from=build /app/dist /app/dist

ENTRYPOINT ["npm", "start"]