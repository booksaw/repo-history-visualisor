/**
 * @jest-environment jsdom
 */

import { getQueryString, getURL } from "../../utils/QueryStringUtils";

test("Test get current query string", () => {
    const windowSpy: any = jest.spyOn(window, "window","get");

    windowSpy.mockImplementation(() => ({
        location: {
            search: "test=1&test2=2"
        }
    }))

    const queryString = getQueryString();
    expect(queryString).toEqual({"test": "1", "test2": "2"});
}); 

test("Build URL with params", () => {

    const url = getURL("test", {query: "test1"});

    expect(url).toEqual("test?query=test1")
});

test("Build URL without params", () => {
    const url = getURL("test", {});

    expect(url).toEqual("test");
});