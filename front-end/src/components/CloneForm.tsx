import { useMemo, useState } from "react";
import { Repository } from "../RepositoryRepresentation";
import { loadJSONData } from "../utils/BackEndCommunicator";
import { getQueryString, setQueryString } from "../utils/QueryStringUtils";
import { QueryParams } from "./App";
import Button from "./Button";
import TextInput from "./TextInput";

export interface CloneFormProps {
    // setCloneURL: (url?: string) => void,
    // setBranch: (branch?: string) => void,
    setVisData: (repo: Repository) => void,
    errorText?: string,
    setErrorText: (text?: string) => void,
    setManualMode: (mode?: boolean) => void,
    setDebugMode: (mode?: boolean) => void,
    setDisplayForm: (displayForm: boolean) => void,
}

export default function CloneForm(props: CloneFormProps) {

    const queryParams: QueryParams = getQueryString();

    const [repositoryUrl, setRepositoryUrl] = useState<string | undefined>(queryParams.clone);
    const [branch, setBranch] = useState<string | undefined>();

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
        const params: QueryParams = {
            clone: repositoryUrl,
            branch: branch,
        };

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
        loadJSONData(repositoryUrl, branch, props.setVisData, props.setErrorText);
    }

    // sets the branch and clone url on initial page load
    useMemo(() => {
        const queryParams: QueryParams = getQueryString();

        if (queryParams.branch && !queryParams.clone) {
            props.setErrorText("Clone URL must be specified in URL");
        } else if (!queryParams.branch && queryParams.clone) {
            props.setErrorText("Branch must be specified in URL");
        } else if (queryParams.branch && queryParams.clone) {

            props.setManualMode(queryParams.manual);
            props.setDebugMode(queryParams.debug);
        }

        setRepositoryUrl(queryParams.clone);
        setBranch(queryParams.branch);
        // console.log("calling update JSON data")
        updateJSONData();
    }, []);

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <form action="###" onSubmit={buildResult} style={{ width: "100%", position: "absolute", top: "40%" }}>
                <TextInput value={repositoryUrl} placeholder="Repository Clone Url..." style={{ width: "40%", minWidth: "190px" }} onChange={setRepositoryUrl} />
                <TextInput value={branch} placeholder="Branch..." style={{ width: "10%", minWidth: "75px" }} onChange={setBranch} />
                <Button type="submit" text="GO!" className="greenButtonBackground" />
                <p style={{ color: "red", fontSize: "medium", paddingTop: "10px" }}>{props.errorText}</p>
            </form>
        </div>
    );

}