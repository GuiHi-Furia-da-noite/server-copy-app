import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';

// Registro de usuário
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, email, password } = req.body;

  try {
    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe!' });
    }

    // Criação do novo usuário
    const user = new User({ username, email, password });
    await user.save();

    // Geração do token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return res.status(201).json({ message: 'Usuário registrado com sucesso!', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
};

// Login do usuário
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Credenciais inválidas!' });
    }

    // Geração do token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login realizado com sucesso!', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao realizar login.' });
  }
};
