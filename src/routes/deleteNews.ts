import express, { Request, Response, RequestHandler } from 'express';
import User from '../models/user';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Tipagem personalizada para Requests com `userId`
interface CustomRequest extends Request {
  userId?: string;
}

// Rota para excluir uma publicação
const deletePublication: RequestHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extrair `userId` do Request customizado
    const userId = req.userId;
    const publicationId = req.params.id;

    // Verificar se o `userId` está presente
    if (!userId) {
      res.status(401).json({ error: 'Usuário não autenticado' });
      return;
    }

    // Encontrar o usuário no banco de dados
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    // Verificar se a publicação existe, utilizando o método `equals()` para comparar ObjectIds
    const publicationIndex = user.publications.findIndex(
      (pub) => pub._id.equals(publicationId)  // Usando `equals` para comparação
    );

    if (publicationIndex === -1) {
      res.status(404).json({ error: 'Publicação não encontrada' });
      return;
    }

    // Excluir a publicação
    user.publications.splice(publicationIndex, 1);
    
    // Salvar as alterações no banco de dados
    await user.save();

    // Responder com sucesso
    res.status(200).json({ message: 'Publicação excluída com sucesso' });
  } catch (error) {
    // Log de erro no servidor
    console.error('Erro ao excluir publicação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Adicionando a rota ao router com o middleware de autenticação
router.delete('/publication/:id', verifyToken, deletePublication);

export default router;
