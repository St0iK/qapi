import mongoose, { Schema, Document } from 'mongoose';

export interface IQuote extends Document {
  author: string;
  quote: string;
}

const QuoteSchema = new Schema({
  author: { type: String, required: true },
  quote: { type: String, required: true },
}, { timestamps: true });


export default mongoose.model<IQuote>('Quote', QuoteSchema);