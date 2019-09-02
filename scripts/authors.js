const MongoClient = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb+srv://readonly:123123123@cluster0-gbjr6.gcp.mongodb.net/test';

(async () => {
  try {
    const client = await MongoClient.connect(url, { poolSize: 20, useNewUrlParser: true });

    global.db = client.db('quotes-parser');
    
    console.log('Running');

    const quotes = await global.db
      .collection('quotes')
      .find({}, { batchSize: 10000 })
      .limit(100)
      .sort({ id: 1 })
      .toArray();

    let authors = [];
    quotes.forEach((quote) => {
    
      if (authors.indexOf(quote.author) == -1) {
        authors.push(quote.author);
      }      

    });

    // We have the list of authors, get quotes by author
    console.log(authors);

    const authorsQuotes = await global.db
      .collection('quotes')
      .find({ author: authors[0] }, { batchSize: 10000 })
      .sort({ id: 1 })
      .toArray();

    console.log(authorsQuotes);

    let q = [];
    authorsQuotes.forEach((authorsQuote) => {
      q.push(authorsQuote.quote);
    });

    const toInsert = {
      author: authors[0],
      quotes: q,
    };

    console.log(toInsert);

  } catch (err) {
    console.log(err.stack);
  }

})();