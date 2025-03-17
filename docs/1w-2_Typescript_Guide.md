###### - 민시우(2025/03/10) 작성 -

## 1w-2-1. 🚀 TypeScript 학습 가이드(+ Node.js)

### [1] Typescript 학습

📌 TypeScript 기본 문법

📌 TypeScript 컴파일러(tsconfig)

📌 클래스 & 인터페이스

📌 고급 타입

📌 제네릭

📌 데코레이터

📌 모듈 및 네임스페이스

---

### [2] Node.js 학습

📌 비동기 방식(Async/Await)

1. 동기(Syncronous): 요청을 보낸 후 해당 요청의 응답을 받아야 다음 동작을 실행하는 방식/순차적(Blocking)
2. 비동기(Asynchronous): 요청을 보낸 후 응답과 관계없이 다음 동작을 실행하는 방식/병렬적(Non-blocking)
3. Promise(프라미스): 비동기 작업의 결과를 나타내는 객체로, 작업이 완료되었거나 실패했는지를 추적할 수 있으며, 이를 통해 콜백 지옥(Callback Hell)을 방지하고, 더 가독성 높은 비동기 코드를 작성할 수 있다.

- pending: (대기) 초기상태, 아직 완료되지 않음
- fulfilled: (성공) 비동기 작업이 성공적으로 완료
- rejected: (실패) 비동기 작업이 실패함

4. await: async 함수 내에서 프라미스가 해결될 때까지 함수의 실행을 기다린 다음 프라미스의 결과와 함께 실행을 재개한다.

```typescript
// Promise 기반 비동기 처리
function asyncTaskPromise(): Promise<void> {
  console.log('1. 작업 시작');

  return new Promise(resolve => {
    setTimeout(() => {
      console.log('2. 2초 후 실행되는 작업');
      resolve();
    }, 2000);
  }).then(() => {
    console.log('3. 작업 완료');
  });
}

asyncTaskPromise();

// async/await 사용한 비동기 처리
async function asyncTaskAwait() {
  console.log('1. 작업 시작');

  await new Promise<void>(resolve =>
    setTimeout(() => {
      console.log('2. 2초 후 실행되는 작업');
      resolve();
    }, 2000),
  );

  console.log('3. 작업 완료');
}

asyncTaskAwait();
```

5. Async/Await을 사용해야 하는 이유

- 비동기 코드를 Promise.then() 체인으로 작성하면 중첩된 코드가 많아지면서 가독성이 떨어질 수 있다. 이때 async/await을 사용하면 비동기 작업을 동기 코드처럼 순차적으로 작성할 수 있어, 한눈에 코드의 실행 흐름을 파악할 수 있어, 가독성 향상 및 코드 유지보수 용이를 위해서 사용하여야 한다.

- Promise.then()을 여러 개 중첩하여 사용하면 코드의 들여쓰기가 깊어지면서 콜백 지옥(Callback Hell)이 발생할 수 있다. 이때 async/await을 사용하면 함수 호출을 마치 동기 코드처럼 순차적으로 작성할 수 있어, 복잡한 중첩을 방지할 수 있다.
- async/await을 사용하면 try/catch 블록을 활용하여 에러를 직관적으로 처리할 수 있다.

📌 모듈 시스템(ESM/CommonJS)

📌 API 테스트 (fetch(), Playwright request API)

---

### [3] 참고자료

- [Typescript 한글판](https://typescript-kr.github.io/)
- [Node.js에서 async/await 이해하기](https://apidog.com/kr/blog/node-js-async-await-2/)
- [CommonJS vs ES Modules](https://medium.com/@hong009319/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98-%ED%91%9C%EC%A4%80-%EC%A0%95%EC%9D%98-commonjs-vs-es-modules-306e5f0a74b1)
- [Node.js Jest 및 API 테스트 개념](https://velog.io/@kon6443/Node-JS-Jest-supertest-%EA%B0%9C%EB%85%90-%EB%B0%8F-CRUD-API-testing-%EA%B0%84%EB%8B%A8-%EC%98%88%EC%A0%9C)
