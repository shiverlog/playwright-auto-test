import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

// Swagger 옵션 설정
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Playwright API Test",
      version: "1.0.0",
      description: "API documentation for Playwright-based tests",
      contact: {
        name: "QA Team",
        email: "qa-team@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000", // 기본 API 서버 URL
        description: "Local development server",
      },
    ],
  },
  apis: ["./tests/api/*.ts"], // API 엔드포인트가 정의된 파일 경로
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger 미들웨어 설정 함수
export function setupSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log("Swagger docs available at: http://localhost:3000/api-docs");
}
