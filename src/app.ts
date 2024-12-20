import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import bodyParser from 'body-parser';
import climateNewsRouter from './routes/newsRoutes';
import deletePublicationRoutes from './routes/deleteNews';
import updateNewsRoutes from './routes/createNews';
import generateNewsFromLink from './routes/linknews'

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Adicionando a rota para a raiz (/)
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/news', climateNewsRouter); // Para as notícias
app.use('/api', deletePublicationRoutes); // Para excluir publicações
app.use('/api', updateNewsRoutes); // Para atualizar publicações
app.use('/api', generateNewsFromLink); // Para atualizar publicações

// Conexão ao banco de dados
connectDB();

export default app;  // Exporte diretamente o app
