const MongoClient = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/quotes-parser';

async function showAvatar() {
  const toInsertArray = [];

  try {
    console.log('Running from inside showAvatar');
    const client = await MongoClient.connect(url, { poolSize: 20, useNewUrlParser: true });

    global.db = client.db('quotes-parser');

    // get a list of all quotes
    const quotes = await global.db
      .collection('quotes')
      .find({})
      .limit(100)
      .sort({ id: 1 })
      .toArray();

    // Build a list of all the authors
    const authors = [];
    quotes.forEach((quote) => {
      if (authors.indexOf(quote.author) === -1) {
        authors.push(quote.author);
      }
    });

    for (const author of authors) {
      // For every author get the quotes
      // eslint-disable-next-line no-await-in-loop
      const authorsQuotes = await global.db
        .collection('quotes')
        .find({ author })
        .sort({ id: 1 })
        .toArray();

      const quotesByAuthor = [];
      authorsQuotes.forEach((authorsQuote) => {
        quotesByAuthor.push(authorsQuote.quote);
      });

      const toInsert = {
        author,
        quotes: quotesByAuthor,
      };
      console.log(toInsert);
      toInsertArray.push(toInsert);
    }
  } catch (err) {
    console.log(err.stack);
  }

  return toInsertArray;
}

// const value = showAvatar();
// console.log(value.then((l) => { console.log(l); }));

(async () => {
  const value = await showAvatar();
  // insert in chuncks
  console.log('Running');
  await global.db.collection('authors').insertMany(value);
})();
