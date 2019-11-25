
const maxResults:number = 100;

export default (q:any) => {
  if (q.limit) {
    return parseInt(q.limit, 10);
  }

  return maxResults;
};
