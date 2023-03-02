import { useState } from 'react';
import './css/App.css';
import CloneForm from './CloneForm';
import { BounceLoader } from 'react-spinners';
import RepositoryVisualisor from './RepositoryVisualisor';
import RepositoryDataManager, { DataState } from '../repository/RepositoryDataManager';

/**
 * The full screen APP 
 * @returns The DOM for the app
 */
function App() {

  const [errorText, setErrorText] = useState<string | undefined>();
  const [repoDataManager, setRepoDataManager] = useState<RepositoryDataManager>();
  const [dataState, setDataState] = useState<DataState>(DataState.AWAITING_LOADING_METADATA);
  const [manualMode, setManualMode] = useState<boolean>();
  const [debugMode, setDebugMode] = useState<boolean>();
  const [hideKey, setHideKey] = useState<boolean>();
  // tracking variable for if the form needs displaying without an error message
  const [displayForm, setDisplayForm] = useState<boolean>(true);

  if (repoDataManager && dataState === DataState.AWAITING_LOADING_COMMITS) {
    repoDataManager.loadCommitData(setErrorText, 0, setDataState);
  }

  return (
    <div className="App">
      {errorText || displayForm
        ?
        <CloneForm
          setDataState={setDataState}
          setRepoDataManager={setRepoDataManager}
          setErrorText={setErrorText}
          errorText={errorText}
          debugMode={debugMode}
          setDebugMode={setDebugMode}
          manualMode={manualMode}
          setManualMode={setManualMode}
          setDisplayForm={setDisplayForm}
          hideKey={hideKey}
          setHideKey={setHideKey}
        />
        :
        (
          repoDataManager && dataState === DataState.READY
            ?
            <RepositoryVisualisor repoDataManager={repoDataManager} debugMode={debugMode} showFullPathOnHover manualMode={manualMode} hideKey={hideKey}/>
            :
            <BounceLoader color='steelblue' />
        )
      }

    </div>
  );
}

export default App;
