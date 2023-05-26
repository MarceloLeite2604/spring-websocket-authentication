FROM node:lts-hydrogen AS builder
WORKDIR /tmp/build
COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .
COPY .env.production .
COPY src src
COPY public public
RUN --mount=type=cache,target=/tmp/build/node_modules,id=node-cache,sharing=locked \
  yarn install && yarn build

FROM nginx:1.25.0-alpine3.17-slim
COPY --chown=1001:1001 --from=builder /tmp/build/build /usr/share/nginx/html