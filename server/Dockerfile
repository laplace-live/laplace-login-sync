FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY . .
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# RUN yarn build
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm build

# If using npm comment out above and use below instead
# RUN npm run build

FROM node:20-alpine

ENV NODE_ENV production

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package*.json ./
COPY --from=base /app/dist ./dist

EXPOSE 8080

ENV PORT 8080

CMD ["npm", "run", "start"]
