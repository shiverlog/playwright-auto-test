FROM mcr.microsoft.com/playwright:v1.51.0-noble

WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV NODE_ENV=test

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY e2e/pc-web ./e2e/pc-web

CMD ["npx", "playwright", "test", "--config=e2e/pc-web/playwright.config.ts"]
