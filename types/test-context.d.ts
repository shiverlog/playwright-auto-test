export interface TestContext {
  platform: 'pc' | 'mw' | 'aos' | 'ios';
  env: 'development' | 'staging' | 'production';
  userId?: string;
}
