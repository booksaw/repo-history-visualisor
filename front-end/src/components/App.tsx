import { useState } from 'react';
import './css/App.css';
import CloneForm from './CloneForm';
import { BounceLoader } from 'react-spinners';
import { Repository } from '../RepositoryRepresentation';
import RepositoryVisualisor from './RepositoryVisualisor';

/**
 * The URL query parameters that can be set
 */
export interface QueryParams {
  clone?: string;
  branch?: string;
  manual?: boolean;
  debug?: boolean;
  milestones?: string;
}

function App() {

  const [errorText, setErrorText] = useState<string | undefined>();
  const [visData, setVisData] = useState<Repository>();
  const [manualMode, setManualMode] = useState<boolean>();
  const [debugMode, setDebugMode] = useState<boolean>();
  // tracking variable for if the form needs displaying without an error message
  const [displayForm, setDisplayForm] = useState<boolean>(true);


  return (
    <div className="App">
      {errorText || displayForm
        ?
        <CloneForm setVisData={setVisData} setErrorText={setErrorText} errorText={errorText} debugMode={debugMode} setDebugMode={setDebugMode} manualMode={manualMode} setManualMode={setManualMode} setDisplayForm={setDisplayForm}/>
        :
        (
          visData
            ?
            <RepositoryVisualisor visData={visData} debugMode={debugMode} showFullPathOnHover manualMode={manualMode} />
            :
            <BounceLoader color='steelblue' />
        )
      }

    </div>
  );
}

export default App;
