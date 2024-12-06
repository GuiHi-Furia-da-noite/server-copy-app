// src/types/newsapi.d.ts
declare module 'newsapi' {
  class NewsAPI {
    constructor(apiKey: string);
    v2: {
      everything(params: {
        q: string;        // Termos de busca
        domains: string;  // Fontes de notícias
        pageSize: number; // Número de notícias
        language: string; // Idioma da notícia
      }): Promise<any>;  // Tipo genérico, pode ser mais específico se necessário
    };
  }

  export = NewsAPI;
}
