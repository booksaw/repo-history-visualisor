
import { RequestParams } from "../repository/RepositoryDataManager";
import { getURL } from "./QueryStringUtils";


export interface CommitRequestParams extends RequestParams {
    startCommit?: number, 
    commitCount?: number,
}

/**
 * Function to fetch repository data from the back-end
 * @param encodedCloneURL The clone URL of the repository 
 * @param branch The branch the user has set
 * @param setData The callback method in the event of a success
 * @param setError The callback method in the event of a failure 
 * @param milestonesURL The url for milestone data
 */
export async function loadCommitData(
    params: CommitRequestParams,
    setData: (data: any) => void,
    setError: (error: string) => void,
) {

    const url = getURL("/api/commitdata", params);
    console.log("Making request to", url)

    performJSONGet(url, setData, setError);
}

async function performJSONGet(
    url: string,
    setData: (data: any) => void,
    setError: (error: string) => void,
) {
    fetch(url)
        .then(async response => {
            if (!response.ok) {
                throw new Error(await response.text());
            }
            return response.json();
        })
        .then(data => {
            setData(data);
        })
        .catch(error => {
            setError("URL Error: " + error.message);
        });
}

export async function performPrevis(
    params: RequestParams,
    setData: (data: any) => void,
    setError: (error: string) => void,
) {

    const url = getURL("/api/previs", params);
    console.log("Making request to:", url);

    performJSONGet(url, setData, setError);

}