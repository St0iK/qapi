import Quote from './Quote';

export class Author {

  private author: string;
  private quotes: Array<Quote>;

  constructor(author: string, quotes: Array<Quote>) {
    this.author = author;
    this.quotes = quotes;
  }

}




const q = new Author('jimstoik13', [new Quote('123','123')]);