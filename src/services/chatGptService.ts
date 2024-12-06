import dotenv from 'dotenv';
dotenv.config();

import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Certifique-se de que a chave está no arquivo .env
});

export const callChatGPTAPI = async (prompt: string): Promise<string> => {
  try {
    // Chamando a API do OpenAI com o prompt fornecido
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', 
      messages: [
        { role: 'system', content: 'Você é um assistente que ajuda a gerar conteúdo baseado em notícias.' },
        { role: 'user', content: prompt }, // Aqui passamos o prompt recebido
      ],
      max_tokens: 1500, // Você pode ajustar o limite de tokens conforme necessário
      temperature: 0.7, // Controla a criatividade da resposta. Ajuste conforme necessário
    });

    // A resposta será diretamente um texto simples, sem a necessidade de parsing
    const completionText = response.choices[0].message?.content;
    if (!completionText) throw new Error('Resposta vazia da API');

    return completionText;  // Retorna o conteúdo gerado
  } catch (error: any) {
    console.error('Erro ao chamar API do ChatGPT:', error);
    throw error;
  }
};
