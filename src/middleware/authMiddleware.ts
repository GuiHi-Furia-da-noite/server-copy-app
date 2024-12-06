import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  userId?: string;
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Token de autenticação ausente' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
