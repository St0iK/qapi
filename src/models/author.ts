import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthor extends Document {
  email: string;
  firstName: string;
  lastName: string;
}

const AuthorSchema = new Schema({
  author: { type: String, required: true },
  quotes: { type: Array, required: true },
}, { timestamps: true });


export default mongoose.model<IAuthor>('Author', AuthorSchema);