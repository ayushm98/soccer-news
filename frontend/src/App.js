import React from 'react';
import Header from './components/Header';
import News from './components/News';

//lets do it
function App() {
  return (
    <div className="App">
      <Header />
      <main style={{ padding: '20px' }}>
        <News />
      </main>
    </div>
  );
}

export default App;
