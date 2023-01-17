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
}

function App() {

  const [encodedCloneURL, setEncodedCloneURL] = useState<string>();
  const [branch, setBranch] = useState<string>();
  const [errorText, setErrorText] = useState<string>();
  const [visData, setVisData] = useState<Repository>();

  // sets the branch and clone url on initial page load
  useMemo(() => {
    const queryParams: QueryParams = getQueryString();

    if (queryParams.branch && !queryParams.clone) {
      setErrorText("Clone URL must be specified in URL");
    } else if (!queryParams.branch && queryParams.clone) {
      setErrorText("Branch must be specified in URL");
    } else if (queryParams.branch && queryParams.clone) {
      setEncodedCloneURL(queryParams.clone);
      setBranch(queryParams.branch);
    }

  }, []);


  useEffect(() => {
    if (!encodedCloneURL || !branch) {
      return;
    }
    loadJSONData(encodedCloneURL, branch, setVisData, setErrorText);
    
  }, [branch, encodedCloneURL]);

  return (
    <div className="App">
      {errorText || !encodedCloneURL || !branch
        ?
        <CloneForm setEncodedCloneURL={setEncodedCloneURL} setBranch={setBranch} setErrorText={setErrorText} errorText={errorText} />
        :
        (
          visData
            ?
            <RepositoryVisualisor visData={visData} debugMode showFullPathOnHover />
            :
            <BounceLoader color='steelblue' />
        )
      }

    </div>
  );
}

export default App;
