

/**
 * Function to fetch repository data from the back-end
 * @param encodedCloneURL The clone URL of the repository 
 * @param branch The branch the user has set
 * @param setData The callback method in the event of a success
 * @param setError The callback method in the event of a failure 
 */
export async function loadJSONData(encodedCloneURL: string, branch: string, setData: (data: any) => void, setError: (error: string) => void) {

    fetch("/api/clone/" + encodedCloneURL + "?branch=" + branch)
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