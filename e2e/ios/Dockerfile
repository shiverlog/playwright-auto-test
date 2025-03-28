FROM mcr.microsoft.com/playwright:v1.51.1-noble

WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV NODE_ENV=test

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY e2e/ios ./e2e/ios

CMD ["npx", "playwright", "test", "--config=e2e/ios/playwright.config.ts"]
