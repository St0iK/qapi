import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import QuoteList from './ui/QuoteList';

function App() {

  const data = [
    {id:1, quote:'Dimitris Stoikidis', author: 'someone'},
    {id:2, quote:'Jim Stoik', author: 'someone'},
  ];

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <QuoteList quotes={data}/>
    </div>
  );
}

export default App;
