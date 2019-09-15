import * as Koa from 'koa'

const maxResults:number = 1000;

export default (q:any) => {
  if (q.limit) {
    return parseInt(q.limit, 10);
  }

  return maxResults;
};
