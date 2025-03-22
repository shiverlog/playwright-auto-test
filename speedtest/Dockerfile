FROM mcr.microsoft.com/playwright:v1.51.1-noble

WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV NODE_ENV=test

COPY speedtest/package.json speedtest/package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY speedtest ./speedtest

CMD ["npx", "playwright", "test", "--config=speedtest/playwright.config.ts"]
