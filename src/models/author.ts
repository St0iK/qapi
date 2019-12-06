import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthor extends Document {
  fullName: string
}

const AuthorSchema = new Schema({
  fullName: { type: String, required: true },
}, { timestamps: true });


export default mongoose.model<IAuthor>('Author', AuthorSchema);