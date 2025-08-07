FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

# Production stage
FROM node:24-alpine AS production

WORKDIR /usr/src/app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /usr/src/app/dist ./dist

RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

EXPOSE 8080

CMD ["node", "dist/main"]
