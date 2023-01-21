import { useEffect, useMemo, useState } from 'react';
import './css/App.css';
import CloneForm from './CloneForm';
import { getQueryString } from '../utils/QueryStringUtils';
import { BounceLoader } from 'react-spinners';
import { loadJSONData } from '../utils/BackEndCommunicator';
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
}

function App() {

  const [cloneURL, setCloneURL] = useState<string>();
  const [branch, setBranch] = useState<string>();
  const [errorText, setErrorText] = useState<string>();
  const [visData, setVisData] = useState<Repository>();
  const [manualMode, setManualMode] = useState<boolean>();
  const [debugMode, setDebugMode] = useState<boolean>();

  // sets the branch and clone url on initial page load
  useMemo(() => {
    const queryParams: QueryParams = getQueryString();

    if (queryParams.branch && !queryParams.clone) {
      setErrorText("Clone URL must be specified in URL");
    } else if (!queryParams.branch && queryParams.clone) {
      setErrorText("Branch must be specified in URL");
    } else if (queryParams.branch && queryParams.clone) {
      setCloneURL(queryParams.clone);
      setBranch(queryParams.branch);
      setManualMode(queryParams.manual);
      setDebugMode(queryParams.debug);
    }

  }, []);


  useEffect(() => {
    if (!cloneURL || !branch) {
      return;
    }
    loadJSONData(cloneURL, branch, setVisData, setErrorText);
    
  }, [branch, cloneURL]);

  return (
    <div className="App">
      {errorText || !cloneURL || !branch
        ?
        <CloneForm setCloneURL={setCloneURL} setBranch={setBranch} setErrorText={setErrorText} errorText={errorText} />
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
