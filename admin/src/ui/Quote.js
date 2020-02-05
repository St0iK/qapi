import React from 'react';

export function Quote(props) {
  // I want to de-sctruct 'quote', but I want to call it
  const { quote: quoteItem } = props;

  const clickHandler = (quoteItem) => {
    console.log(`☘️ You clicked ${quoteItem.author}`);
  };

  if (quoteItem.length === 0) {
    return (
      <p className="alert alert-info">No Items</p>
    );
  }

  return (
    <div className='quote-item'>
      <p onClick={clickHandler(quoteItem)}>{quoteItem.id} | {quoteItem.quote} | {quoteItem.author}</p>
    </div>
  );
}

export default Quote;