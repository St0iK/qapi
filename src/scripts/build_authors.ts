import Quote, { IQuote } from '../models/quote';
import Author, { IAuthor } from '../models/author';
import dbLoader from '../loaders/db';
import Logger from '../loaders/logger';

async function getAllQuotes(): Promise<IQuote[]> {
    return await Quote.find({}).sort({ id: 1 }).exec();
}


async function process() { 
    
    await dbLoader();

    const allQuotes = await getAllQuotes();
    

    const authors = [];
    allQuotes.forEach((quote:IQuote) => {
        if (!authors.includes(quote.author)) {
            authors.push(new Author({fullName: quote.author}));
        }
    });

    Author.insertMany(authors);

    Logger.info(`
    ################################################
     ✅                 DONE                     ✅
    ################################################
  `);
}

process();
