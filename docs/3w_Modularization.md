# Modularization (모듈화) (03/24 - 03/28)

- NPM : https://www.npmjs.com/
## common npm 모듈로 패키징
```
cd common
npm init -y
npm login
npm publish --access restricted
npm login --registry=https://npm.pkg.github.com
```

npx playwright test
npx playwright test tests-examples/demo-todo-app.spec.ts
npx playwright show-report
npx playwright test tests/example.spec.ts
