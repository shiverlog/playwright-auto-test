FROM mcr.microsoft.com/playwright:v1.51.0-noble

WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV NODE_ENV=test

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY e2e/api ./e2e/api

CMD ["npx", "playwright", "test", "--config=e2e/api/playwright.config.ts"]
