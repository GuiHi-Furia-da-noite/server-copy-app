import http from 'http';
import app from './app';

const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

server.timeout = 5 * 60 * 1000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;