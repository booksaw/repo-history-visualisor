import { QueryParams } from "../components/App";
import { getURL } from "./QueryStringUtils";


/**
 * Function to fetch repository data from the back-end
 * @param encodedCloneURL The clone URL of the repository 
 * @param branch The branch the user has set
 * @param setData The callback method in the event of a success
 * @param setError The callback method in the event of a failure 
 */
export async function loadJSONData(cloneURL: string, branch: string, setData: (data: any) => void, setError: (error: string) => void) {

    const params: QueryParams = {
        clone: cloneURL,
        branch: branch,
    };
    const url = getURL("/api/clone/", params);

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