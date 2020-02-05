import Quote, { IQuote } from '../models/quote';
import Author, { IAuthor } from '../models/author';
import dbLoader from '../loaders/db';
import Logger from '../loaders/logger';

async function getAllQuotes(): Promise<IQuote[]> {
    return await Quote.find({}).sort({ id: 1 }).exec();
}


async function process() {
    await dbLoader();

    Logger.info(`Getting all Quotes 🏄‍️`);
    const allQuotes = await getAllQuotes();

    const authors = [];
    allQuotes.forEach((quote:IQuote) => {
        if (!authors.some(a => a.fullName === quote.author)) {
            Logger.info(`Just added ${quote.author} 🏋️‍`);
            authors.push(new Author({fullName: quote.author}));
        }
    });

    await Author.insertMany(authors);
    Logger.info(`Done ✅`);
}

process();
