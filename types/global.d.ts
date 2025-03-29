declare namespace NodeJS {
  interface Global {
    isCI: boolean;
    currentTestPlatform: string;
  }
}
