# syntax=docker/dockerfile:1

FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS deps
WORKDIR /app

COPY package.json package-lock.json* ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS runner

RUN mkdir -p /home/node/app /mnt/app-data && \
    chown -R node:node /home/node/app /mnt/app-data

WORKDIR /home/node/app

ENV NODE_ENV=production
ENV PORT=3000

USER node

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

EXPOSE $PORT

CMD ["node", "server.js"]
