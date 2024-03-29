export class AppConfig {
  private static INSTANCE: AppConfig;
  public static get instance() {
    if (!this.INSTANCE) {
      this.INSTANCE = new AppConfig();
    }
    return this.INSTANCE;
  }

  public get apiUrl(): string {
    // 本番用
    return process.env.VUE_APP_API_ENDPOINT;
    // 開発用-ローカル
    //return "http://192.168.11.8:8080/api";
  }

  public get isMaintenance(): boolean {
    return process.env.NODE_ENV == 'development';
  }
}

export default AppConfig.instance;
