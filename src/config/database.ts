import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    } else {
      console.error('Erro desconhecido ao conectar ao MongoDB');
    }
    process.exit(1); // Interrompe a execução caso não consiga conectar
  }
};

export default connectDB;
