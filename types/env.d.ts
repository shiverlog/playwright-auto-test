interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly UPLUS_ID: string;
  readonly UPLUS_PW: string;
  readonly ENV: 'development' | 'staging' | 'production';
  readonly HEADLESS: 'true' | 'false';
}
