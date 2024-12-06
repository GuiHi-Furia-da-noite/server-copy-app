import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  publications: Array<{
    _id: Types.ObjectId; // Incluindo o campo _id
    title: string;
    description: string;
    content: any; // Alterado para `any` ou `Schema.Types.Mixed` para permitir objetos complexos
    sourceUrl: string;
    createdAt: Date;
  }>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  publications: [{
    title: { type: String, required: false },
    description: { type: String, required: false },
    content: { type: Schema.Types.Mixed, required: false },  // Alterado para Schema.Types.Mixed
    sourceUrl: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
