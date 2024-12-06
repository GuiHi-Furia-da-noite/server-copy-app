import express, { Request, Response, RequestHandler } from 'express';
import dotenv from 'dotenv';
import axios from 'axios'; // Para fazer as requisições HTTP
import { callChatGPTAPI } from '../services/chatGptService';
import jwt from 'jsonwebtoken';
import User from '../models/user';

dotenv.config(); // Carregar variáveis de ambiente

// Verificando se a chave da API está presente
const apiKey = process.env.NEWS_API_KEY;
if (!apiKey) {
  throw new Error('NEWS_API_KEY is not defined in the environment variables');
}

const router = express.Router(); // Definindo o router para rotas específicas

// Função para verificar o token JWT e obter o usuário
const getUserFromToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// Rota para buscar notícias personalizadas e gerar conteúdo com o ChatGPT
const climateNewsRouter: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Token de autenticação ausente' });
    return;
  }

  const userId = getUserFromToken(token);
  if (!userId) {
    res.status(401).json({ error: 'Usuário não autenticado' });
    return;
  }

  const { keywords, source } = req.body;

  if (!keywords || !source) {
    res.status(400).json({ error: 'Palavras-chave e fonte são obrigatórias' });
    return;
  }

  try {
    // Fazendo a chamada para a NewsAPI diretamente
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${keywords}&domains=${source}&apiKey=${apiKey}&language=pt&pageSize=3`;

    const response = await axios.get(newsApiUrl);

    if (response.data.articles && response.data.articles.length > 0) {
      // Selecionando uma notícia aleatória
      const randomIndex = Math.floor(Math.random() * response.data.articles.length);
      const selectedArticle = response.data.articles[randomIndex];

      // Criando o prompt para enviar ao ChatGPT com a notícia aleatória
      const prompt = `
Você é um assistente especializado na criação de publicações de múltiplas páginas, baseado nas notícias fornecidas. Crie uma publicação estruturada em 5 páginas com as seguintes características:
Capa Inicial (Página 1):
Título (Máximo 14 caracteres): Adapte o título para que se encaixe no limite de caracteres, mantendo o tema da notícia.
Subtítulo curto (Máximo 18 caracteres): Resuma a essência da notícia em poucas palavras.
Página 2:
Título (Máximo 14 caracteres): Relacione o título com o conteúdo central da notícia, sem grandes modificações.
Subtítulo curto (Máximo 18 caracteres): Refira-se ao ponto principal da notícia.
Texto (Máximo 248 caracteres): Apresente o conteúdo diretamente relacionado à notícia, sem referências à FieldPRO. O foco deve ser continuar a explicação da notícia original.
Página 3:
Título (Máximo 14 caracteres): Relacione o título com o conteúdo da notícia.
Subtítulo curto (Máximo 18 caracteres): Destaque um benefício ou ponto importante.
Texto (Máximo 248 caracteres): Expanda a explicação da notícia, detalhando mais sobre os impactos da informação, sem mencionar a FieldPRO.
Página 4:
Título (Máximo 14 caracteres): Comece a integrar a FieldPRO ao contexto da notícia.
Subtítulo curto (Máximo 18 caracteres): Relacione o impacto do monitoramento climático com a notícia.
Texto (Máximo 248 caracteres): A partir desta página, insira o papel da FieldPRO. Descreva como a tecnologia de monitoramento climático da FieldPRO pode influenciar a eficácia das tecnologias mencionadas, como IA.
Página 5:
Título (Máximo 14 caracteres): Relacione a continuidade da integração da FieldPRO com as tecnologias mencionadas.
Subtítulo curto (Máximo 18 caracteres): Destaque a combinação das tecnologias.
Texto (Máximo 248 caracteres): Explique como a FieldPRO pode otimizar a implementação de IA, conectando previsões climáticas e soluções tecnológicas para uma operação mais eficiente e sustentável.

Estrutura de Resposta JSON (para adaptação ao código fornecido):
A resposta deve ser organizada como segue:
{
  "Paginas": {
    "Capa": { 
      "Title": "Título da Capa",
      "Subtitulo": "Subtítulo da Capa"
    },
    "Pagina 2": {
      "Titulo": "Título Página 2",
      "Subtitulo": "Subtítulo Página 2",
      "Texto": "Texto da Página 2"
    },
    "Pagina 3": {
      "Titulo": "Título Página 3",
      "Subtitulo": "Subtítulo Página 3",
      "Texto": "Texto da Página 3"
    },
    "Pagina 4": {
      "Titulo": "Título Página 4",
      "Subtitulo": "Subtítulo Página 4",
      "Texto": "Texto da Página 4"
    },
    "Pagina 5": {
      "Titulo": "Título Página 5",
      "Subtitulo": "Subtítulo Página 5",
      "Texto": "Texto da Página 5"
    }
  }
}
Texto da Notícia: Inclua aqui as informações de título, descrição e conteúdo da notícia para serem utilizadas no desenvolvimento das páginas.
{
  "Titulo": "${selectedArticle.title}",
  "Descrição": "${selectedArticle.description}",
  "Content": "${selectedArticle.content}"
}
      `;

      try {
        const chatGptResponse = await callChatGPTAPI(prompt);

        // Limpar o conteúdo removendo os delimitadores de código
        const cleanContent = chatGptResponse.replace(/```json|```/g, '').trim();

        // Criando a nova publicação para salvar no MongoDB
        const publication = {
          title: selectedArticle.title,
          description: selectedArticle.description || 'Sem descrição disponível',
          content: cleanContent, // Agora o conteúdo limpo será usado
          sourceUrl: selectedArticle.url,
          createdAt: new Date()
        };

        // Verificar se o campo 'content' é uma string JSON e, se for, convertê-lo para um objeto
        if (typeof publication.content === 'string') {
          try {
            publication.content = JSON.parse(publication.content); // Converte a string para um objeto
          } catch (error) {
            console.error('Erro ao converter content para objeto:', error);
          }
        }

        // Encontrando o usuário e salvando a publicação
        await User.findByIdAndUpdate(userId, {
          $push: { publications: publication }
        });

        res.json({
          message: 'Postagem criada com sucesso!',
          publication
        });
      } catch (error) {
        console.error('Erro ao gerar conteúdo do ChatGPT:', error);
        res.status(500).json({ error: 'Erro ao gerar conteúdo' });
      }
    } else {
      res.status(404).json({ error: 'Nenhuma notícia encontrada com os critérios fornecidos' });
    }
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
};

router.post('/climate-news', climateNewsRouter);

export default router;
