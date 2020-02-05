import React, { Fragment, useState } from 'react';
import Quote from './Quote';

export function QuoteList(props) {

  const [count, setCount] = useState(0);

  return (
    <div className="container">

      <p>You clicked {count} times</p>

      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>

      { props.quotes.map((quote) => (<Quote quote={quote} key={quote.id}/>) )}

    </div>
  );
}

export default QuoteList;