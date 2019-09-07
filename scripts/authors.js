
const MongoClient = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/quotes-parser';
const toInsertArray = [];

(async () => {
  try {
    console.log(toInsertArray)
    const client = await MongoClient.connect(url, { poolSize: 20, useNewUrlParser: true });

    global.db = client.db('quotes-parser');

    // get a list of all quotes
    const quotes = await global.db
      .collection('quotes')
      .find({})
      // .limit(10000)
      .sort({ id: 1 })
      .toArray();

    // Build a list of all the authors
    const authors = [];
    quotes.forEach((quote) => {
      if (authors.indexOf(quote.author) === -1) {
        authors.push(quote.author);
      }
    });

    // We have the list of authors, get quotes by author
    // console.log(authors);
    

    authors.forEach(async (author) => {
      // For every author get the quotes
      const authorsQuotes = await global.db
        .collection('quotes')
        .find({ author })
        .sort({ id: 1 })
        .toArray();

      // console.log('Quotes by Author:');
      // console.log(authorsQuotes);

      const quotesByAuthor = [];
      authorsQuotes.forEach((authorsQuote) => {
        quotesByAuthor.push(authorsQuote.quote);
      });

      const toInsert = {
        author,
        quotes: quotesByAuthor,
      };
      
      console.log(toInsert);

      await global.db.collection('authors').insertOne(toInsert);
    });
  } catch (err) {
    console.log(err.stack);
  }

  console.log('Done');


})();