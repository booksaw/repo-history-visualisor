import { useRef, useState } from "react";
import { setQueryString } from "../utils/QueryStringUtils";
import { QueryParams } from "./App";
import Button from "./Button";
import TextInput from "./TextInput";

export interface CloneFormProps {
    setCloneURL: (url?: string) => void,
    setBranch: (branch?: string) => void,
    errorText?: string,
    setErrorText: (text?: string) => void,
}

export default function CloneForm(props: CloneFormProps) {

    const [repositoryUrl, setRepositoryUrl] = useState<string>();
    const [branch, setBranch] = useState<string>();



    function buildResult(e: any) {
        e.preventDefault();

        if (!repositoryUrl) {
            props.setErrorText("Repository URL must be specified");
            return;
        } else if (!branch) {
            props.setErrorText("Branch must be specified");
            return;
        }

        // encoding the repository URL as required to be sent via query string 
        const encodedUrl = encodeURIComponent(encodeURIComponent(repositoryUrl));

        // creating the query 
        const params: QueryParams = {
            clone: encodedUrl,
            branch: branch,
        };

        setQueryString(params);

        props.setCloneURL(repositoryUrl);
        props.setBranch(branch);
        // clearning error text tells parent component not to hide network diagram
        props.setErrorText(undefined);


    }

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <form action="###" onSubmit={buildResult} style={{ width: "100%", position: "absolute", top: "40%" }}>
                <TextInput placeholder="Repository Clone Url..." style={{ width: "40%", minWidth: "190px" }} onChange={setRepositoryUrl} />
                <TextInput placeholder="Branch..." style={{ width: "10%", minWidth: "75px" }} onChange={setBranch} />
                <Button type="submit" text="GO!" className="greenButtonBackground" />
                <p style={{ color: "red", fontSize: "medium", paddingTop: "10px" }}>{props.errorText}</p>
            </form>
        </div>
    );

}