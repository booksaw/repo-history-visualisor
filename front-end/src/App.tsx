import React from 'react';
import './App.css';
import NetworkDiagram from './components/NetworkDiagram';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NetworkDiagram showDirectories/>
      </header>
    </div>
  );
}

export default App;
