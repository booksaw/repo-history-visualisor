

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