import { useRef, useState } from "react";
import Button from "./Button";
import TextInput from "./TextInput";

export interface CloneFormProps {

}

export default function CloneForm(props: CloneFormProps) {

    const [repositoryUrl, setRepositoryUrl] = useState<string>();
    const [branch, setBranch] = useState<string>();
    const [errorText, setErrorText] = useState<string>();

    function getPathFromUrl(url: string) {
        return url.split("?")[0];
    }

    function buildResult(e: any) {
        e.preventDefault();

        // adding the query string with the required results to the url
        let currentUrl = getPathFromUrl(window.location.href);

        if (!repositoryUrl) {
            setErrorText("Repository URL must be specified");
            return;
        } else if (!branch) {
            setErrorText("Branch must be specified");
            return;
        }

        // encoding the repository URL as required to be sent via query string 
        const encodedUrl = encodeURIComponent(encodeURIComponent(repositoryUrl));

        // creating the query 
        const params = new URLSearchParams({
            clone: encodedUrl,
            branch: branch,
        });

        let newurl = currentUrl + "?" + params.toString();
        window.history.pushState({ path: newurl }, '', newurl);

    }

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <form action="###" onSubmit={buildResult} style={{ width: "100%", position: "absolute", top: "40%"}}>
                <TextInput placeholder="Repository Clone Url..." style={{ width: "40%", minWidth: "190px" }} onChange={setRepositoryUrl} />
                <TextInput placeholder="Branch..." style={{ width: "10%", minWidth: "75px" }} onChange={setBranch} />
                <Button type="submit" text="GO!" className="greenButtonBackground" />
                <p style={{ color: "red", fontSize: "medium", paddingTop: "10px" }}>{errorText}</p>
            </form>
        </div>
    );

}