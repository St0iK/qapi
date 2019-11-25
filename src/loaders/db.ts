import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';

const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/quotes-parser';

export default async (): Promise<Db> => {
    mongoose.connect(url, {useNewUrlParser: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
      console.log("Connected!");
    });


    const client = await MongoClient.connect(url, { poolSize: 20, useNewUrlParser: true });
    return client.db('quotes-parser');
}