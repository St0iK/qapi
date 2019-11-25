export default (q) => {
  
  if (q.offset) {
    return parseInt(q.offset, 10);
  } 

  return 0;
};
