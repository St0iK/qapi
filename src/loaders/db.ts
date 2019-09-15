import { MongoClient, Db } from 'mongodb';
const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/quotes-parser';

export default async (): Promise<Db> => { 
    const client = await MongoClient.connect(url, { poolSize: 20, useNewUrlParser: true });
    return client.db('quotes-parser');
}