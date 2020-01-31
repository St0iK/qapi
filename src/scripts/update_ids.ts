import Quote, { IQuote } from '../models/quote';
import Author, { IAuthor } from '../models/author';
import dbLoader from '../loaders/db';
import Logger from '../loaders/logger';

async function getAllQuotes(): Promise<IQuote[]> {
  return await Quote.find({}).sort({id: 1}).exec();
}

async function getAllAuthors(): Promise<IAuthor[]> {
  return await Author.find({}).sort({id: 1}).exec();
}

async function process() {

  await dbLoader();

  const allQuotes = await getAllQuotes();
  const allAuthors = await getAllAuthors();

  for (const quote of allQuotes) {

    // get Author details by full name
    const author = allAuthors.find(author => author.fullName === quote.author);

    // Update Quote with the author id
    await Quote.updateOne({author: quote.author}, {
      authorId: author._id
    });

    Logger.info(`${author.fullName}`);
  }

  Logger.info(`Done ✅`);
}

process();
