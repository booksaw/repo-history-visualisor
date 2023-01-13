import React, { useMemo, useState } from 'react';
import './css/App.css';
import CloneForm from './CloneForm';
import NetworkDiagram from './NetworkDiagram';
import { getQueryString } from '../utils/QueryStringUtils';

/**
 * The URL query parameters that can be set
 */
export interface QueryParams {
  clone?: string;
  branch?: string;
}

function App() {

  const [cloneURL, setCloneURL] = useState<string>();
  const [branch, setBranch] = useState<string>();
  const [errorText, setErrorText] = useState<string>();

  // sets the branch and clone url on initial page load
  useMemo(() => {
    // const queryParams new URLSearchParams
    const queryParams: QueryParams = getQueryString();

    if (queryParams.branch && !queryParams.clone) {
      setErrorText("Clone URL must be specified in URL");
    } else if (!queryParams.branch && queryParams.clone) {
      setErrorText("Branch must be specified in URL");
    } else if (queryParams.branch && queryParams.clone) {
      setCloneURL(queryParams.clone);
      setBranch(queryParams.branch);
    }

  }, []);

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
