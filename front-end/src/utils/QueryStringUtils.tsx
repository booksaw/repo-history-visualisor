

export function getQueryString(): any {

    const queryParams = new URLSearchParams(window.location.search);
    const object: { [key: string]: string } = {};

    for (const [key, value] of queryParams.entries()) {
        object[key] = value;
    }

    return object;
}

export function getURL(base: string, object: any) {
    const params = new URLSearchParams(object);

    return base + "?" + params.toString();
}

export function setQueryString(object: any) {
    // adding the query string with the required results to the url
    let currentUrl = getPathFromUrl(window.location.href);

    let newurl = getURL(currentUrl, object);
    window.history.pushState({ path: newurl }, '', newurl);

}


function getPathFromUrl(url: string) {
    return url.split("?")[0];
}