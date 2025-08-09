import React from 'react';
import Terminal from './components/Terminal';

function App() {
  return (
    <div onClick={() => {
      // Keep terminal focused
      const input = document.querySelector('input');
      if (input) input.focus();
    }}>
      <Terminal />
    </div>
  );
}

export default App;