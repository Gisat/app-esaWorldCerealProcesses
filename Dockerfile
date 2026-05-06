# syntax=docker/dockerfile:1

FROM node:lts-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM node:lts-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

FROM node:lts-alpine AS runner

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
