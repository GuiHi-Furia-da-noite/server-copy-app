import express, { Request, Response } from 'express';
import User from '../models/user'; // Modelo de usuário
import { verifyToken } from '../middleware/authMiddleware'; // Middleware de autenticação

const router = express.Router();

// Tipagem personalizada para Requests com `userId`
interface CustomRequest extends Request {
  userId?: string;
}

// Rota para atualizar um campo específico de uma página de uma publicação
router.put('/publications/:id', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const publicationId = req.params.id;
    const { pageId, field, value } = req.body; // `pageId`, `field`, e `value` são fornecidos no corpo da requisição

    if (!userId) {
      res.status(401).json({ error: 'Usuário não autenticado' });
      return;
    }

    // Encontrar o usuário pelo ID
    const user = (await User.findById(userId)) as any;

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    // Encontrar a publicação
    const publication = user.publications.find((pub: any) => pub._id.toString() === publicationId);

    if (!publication) {
      res.status(404).json({ error: 'Publicação não encontrada' });
      return;
    }

    // Acessar o campo específico a ser atualizado
    const page = publication.content?.Paginas?.[pageId];

    if (!page) {
      res.status(400).json({ error: `Página "${pageId}" não encontrada` });
      return;
    }

    // Verificar se o campo existe na página
    if (!(field in page)) {
      res.status(400).json({ error: `Campo "${field}" não encontrado na página` });
      return;
    }

    // Atualizar o campo com o novo valor
    page[field] = value;

    // Atualizar a publicação no usuário
    const publicationIndex = user.publications.findIndex((pub: any) => pub._id.toString() === publicationId);
    user.publications[publicationIndex] = publication;

    // Salvar as alterações no banco de dados
    await User.updateOne({ _id: userId }, { $set: { publications: user.publications } });

    res.status(200).json({ message: 'Publicação atualizada com sucesso', updatedPublication: publication });
  } catch (error) {
    console.error('Erro ao atualizar publicação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
