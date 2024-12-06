
declare module 'newsapi' {
    class NewsAPI {
      constructor(apiKey: string);
      v2: {
        topHeadlines(params: any): Promise<any>;
        everything(params: any): Promise<any>;
        sources(params: any): Promise<any>;
      };
    }
    export = NewsAPI;
  }
  