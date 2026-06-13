# ── Build stage ────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/

RUN npm ci && npm --prefix client ci
COPY . .
RUN npm run build:client && npm prune --omit=dev && rm -rf client/node_modules

# ── Production stage ───────────────────────────────────────────
FROM node:22-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/client/dist ./client/dist
COPY --chown=appuser:appgroup server.js package.json .env.example ./
COPY --chown=appuser:appgroup utils ./utils

RUN mkdir -p uploads logs && chown appuser:appgroup uploads logs

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
