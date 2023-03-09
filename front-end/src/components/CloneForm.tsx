import { useEffect, useState } from "react";
import RepositoryDataManager, { DataState, RequestParams } from "../repository/RepositoryDataManager";
import { getQueryString, setQueryString } from "../utils/QueryStringUtils";
import { SpeedOptions, VisualisationSpeedOptions } from "../visualisation/VisualisationSpeedOptions";
import Button from "./Button";
import MoreOptions from "./MoreOptions";
import TextInput from "./TextInput";

export interface CloneFormProps {
    setRepoDataManager: (repo: RepositoryDataManager) => void,
    errorText?: string,
    setErrorText: (text?: string) => void,
    visSpeed: VisualisationSpeedOptions,
    setVisSpeed: (mode: VisualisationSpeedOptions) => void,
    debugMode?: boolean,
    setDebugMode: (mode?: boolean) => void,
    hideKey?: boolean,
    setHideKey: (hideKey?: boolean) => void,
    displayFileNames?: boolean,
    setDisplayFileNames: (displayFileNames?: boolean) => void,
    setDisplayForm: (displayForm: boolean) => void,
    setDataState: (state: DataState) => void
}

/**
 * Clone form is the component in charge of getting user input of what to visualise 
 * @param props The properties required for the form 
 * @returns The DOM for the component
 */
export default function CloneForm(props: CloneFormProps) {

    const queryParams: RequestParams = getQueryString();

    const [repositoryUrl, setRepositoryUrl] = useState<string | undefined>(queryParams.clone);
    const [branch, setBranch] = useState<string | undefined>();
    const [settingsURL, setSettingsURL] = useState<string | undefined>();

    function buildResult(e: any) {
        e.preventDefault();
        if (!repositoryUrl) {
            props.setErrorText("Repository URL must be specified");
            return;
        } else if (!branch) {
            props.setErrorText("Branch must be specified");
            return;
        }

        // creating the query 
        const params: RequestParams = {
            clone: repositoryUrl,
            branch: branch,
        };

        if (props.debugMode) {
            params.debug = true;
        }
        if (settingsURL) {
            params.settings = settingsURL;
        }
        if (props.hideKey) {
            params.hideKey = true;
        }
        if (props.displayFileNames === false) {
            params.displayFileNames = false;
        }
        if (props.visSpeed !== SpeedOptions.NORMAL) {
            params.visSpeed = SpeedOptions.getStringFromVisSpeed(props.visSpeed);
        }

        setQueryString(params);

        // clearning error text tells parent component not to hide network diagram
        props.setErrorText(undefined);

        updateJSONData(params);

    }

    const updateJSONData = (params: RequestParams) => {

        props.setDisplayForm(false);
        let datamanager = new RepositoryDataManager(params)
        datamanager.requestInitialMetadata(props.setErrorText, props.setDataState);
        props.setRepoDataManager(datamanager);

    }

    // sets the branch and clone url on initial page load


    useEffect(() => {
        const queryParams: RequestParams = getQueryString();
        if (!queryParams.clone && !queryParams.branch) {
            return;
        }
        if (queryParams.branch && !queryParams.clone) {
            props.setErrorText("Clone URL must be specified in URL");
            return;
        } else if (!queryParams.branch && queryParams.clone) {
            props.setErrorText("Branch must be specified in URL");
            return;
        } else if (queryParams.branch && queryParams.clone) {

            props.setVisSpeed(SpeedOptions.getVisSpeedFromString(queryParams.visSpeed));
            props.setDebugMode(queryParams.debug);
            props.setHideKey(queryParams.hideKey)
            props.setDisplayFileNames(queryParams.displayFileNames);
            setSettingsURL(queryParams.settings)
        }

        setRepositoryUrl(queryParams.clone);
        setBranch(queryParams.branch);
        updateJSONData(queryParams);
        // eslint-disable-next-line
    }, []);

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <form action="###" onSubmit={buildResult} style={{ width: "100%", position: "absolute", top: "40%" }}>
                <TextInput value={repositoryUrl ? repositoryUrl : ""} placeholder="Repository Clone Url..." style={{ width: "40%", minWidth: "190px" }} onChange={setRepositoryUrl} data-testid="clone" />
                <TextInput value={branch ? branch : ""} placeholder="Branch..." style={{ width: "10%", minWidth: "75px" }} onChange={setBranch} />
                <Button type="submit" text="GO!" className="greenButtonBackground" />
                <p id={"cloneErrorText"} style={{ color: "red", fontSize: "medium", paddingTop: "10px" }}>{props.errorText}</p>
            </form>
            <MoreOptions
                debugMode={props.debugMode} setDebugMode={props.setDebugMode}
                visSpeed={props.visSpeed} setVisSpeed={props.setVisSpeed}
                settingsURL={settingsURL} setSettingsURL={setSettingsURL}
                hideKey={props.hideKey} setHideKey={props.setHideKey} 
                displayFileNames={props.displayFileNames} setDisplayFileNames={props.setDisplayFileNames}
                />
        </div>
    );

}