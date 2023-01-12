import React from 'react';
import './App.css';
import CloneForm from './components/CloneForm';
import NetworkDiagram from './components/NetworkDiagram';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CloneForm />
        {/* <NetworkDiagram showDirectories/> */}
      </header>
    </div>
  );
}

export default App;
