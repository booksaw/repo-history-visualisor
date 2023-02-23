import { useEffect, useState } from "react";
import { Repository } from "../repository/RepositoryRepresentation";
import { loadJSONData } from "../utils/BackEndCommunicator";
import { getQueryString, setQueryString } from "../utils/QueryStringUtils";
import { QueryParams } from "./App";
import Button from "./Button";
import MoreOptions from "./MoreOptions";
import TextInput from "./TextInput";

export interface CloneFormProps {
    setVisData: (repo: Repository) => void,
    errorText?: string,
    setErrorText: (text?: string) => void,
    manualMode?: boolean,
    setManualMode: (mode?: boolean) => void,
    debugMode?: boolean,
    setDebugMode: (mode?: boolean) => void,
    setDisplayForm: (displayForm: boolean) => void,
}

/**
 * Clone form is the component in charge of getting user input of what to visualise 
 * @param props The properties required for the form 
 * @returns The DOM for the component
 */
export default function CloneForm(props: CloneFormProps) {

    const queryParams: QueryParams = getQueryString();

    const [repositoryUrl, setRepositoryUrl] = useState<string | undefined>(queryParams.clone);
    const [branch, setBranch] = useState<string | undefined>();
    const [milestoneURL, setMilestoneURL] = useState<string | undefined>();

    function buildResult(e: any) {
        e.preventDefault();
        console.log("Submitting result")
        if (!repositoryUrl) {
            props.setErrorText("Repository URL must be specified");
            return;
        } else if (!branch) {
            props.setErrorText("Branch must be specified");
            return;
        }

        // creating the query 
        const params: QueryParams = {
            clone: repositoryUrl,
            branch: branch,
        };

        if (props.debugMode) {
            params.debug = true;
        }
        if (milestoneURL) {
            params.milestones = milestoneURL;
        }

        setQueryString(params);

        // clearning error text tells parent component not to hide network diagram
        props.setErrorText(undefined);

        updateJSONData();

    }

    const updateJSONData = () => {
        if (!repositoryUrl || !branch) {
            return;
        }

        props.setDisplayForm(false);
        loadJSONData(repositoryUrl, branch, props.setVisData, props.setErrorText, milestoneURL);
    }

    // sets the branch and clone url on initial page load


    useEffect(() => {
        const queryParams: QueryParams = getQueryString();
        console.log("query params = ", queryParams);
        if (queryParams.branch && !queryParams.clone) {
            props.setErrorText("Clone URL must be specified in URL");
        } else if (!queryParams.branch && queryParams.clone) {
            props.setErrorText("Branch must be specified in URL");
        } else if (queryParams.branch && queryParams.clone) {

            props.setManualMode(queryParams.manual);
            props.setDebugMode(queryParams.debug);
            setMilestoneURL(queryParams.milestones)
        }

        setRepositoryUrl(queryParams.clone);
        setBranch(queryParams.branch);
        // console.log("calling update JSON data")
        updateJSONData();
        // eslint-disable-next-line
    }, []);

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <form action="###" onSubmit={buildResult} style={{ width: "100%", position: "absolute", top: "40%" }}>
                <TextInput value={repositoryUrl ? repositoryUrl : ""} placeholder="Repository Clone Url..." style={{ width: "40%", minWidth: "190px" }} onChange={setRepositoryUrl} data-testid="clone" />
                <TextInput value={branch ? branch : ""} placeholder="Branch..." style={{ width: "10%", minWidth: "75px" }} onChange={setBranch} />
                <Button type="submit" text="GO!" className="greenButtonBackground" />
                <p id={"cloneErrorText"}style={{ color: "red", fontSize: "medium", paddingTop: "10px" }}>{props.errorText}</p>
            </form>
            <MoreOptions debugMode={props.debugMode} setDebugMode={props.setDebugMode} manualMode={props.manualMode} setManualMode={props.setManualMode} milestoneURL={milestoneURL} setMilestoneURL={setMilestoneURL} />
        </div>
    );

}