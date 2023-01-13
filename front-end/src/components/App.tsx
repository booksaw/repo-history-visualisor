import React, { useState } from 'react';
import './css/App.css';
import CloneForm from './CloneForm';
import NetworkDiagram from './NetworkDiagram';


function App() {

  const [cloneURL, setCloneURL] = useState<string>();
  const [branch, setBranch] = useState<string>();
  const [errorText, setErrorText] = useState<string>();

  console.log("cloneURL", cloneURL);
  console.log("branch", branch);

  return (
    <div className="App">
      {errorText || !cloneURL || !branch
        ?
        <CloneForm setCloneURL={setCloneURL} setBranch={setBranch} setErrorText={setErrorText} errorText={errorText} />
        :
        <NetworkDiagram showDirectories />
      }

    </div>
  );
}

export default App;
