/**
 * @jest-environment jsdom
 */
import { RequestParams } from "../../repository/RepositoryDataManager";
import { loadCommitData, performPrevis } from "../../utils/BackEndCommunicator";


test("Test calling previs", async () => {
    // global.fetch = jest.fn().mockImplementation(setupFetchStub({}))
    const response: any = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ dtest: "dtest" })
    });

    global.fetch = jest.fn().mockImplementation(response);

    const params: RequestParams = { repo: "clone", branch: "branch" };
    let data: any;

    await performPrevis(params,
        (setdata: any) => {
            data = setdata;

            expect(data).toEqual({ dtest: "dtest" });
        }, () => { });


    jest.resetAllMocks();

});

test("Test calling commitdata", async () => {
    // global.fetch = jest.fn().mockImplementation(setupFetchStub({}))
    const response: any = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ dtest: "dtest" })
    });

    global.fetch = jest.fn().mockImplementation(response);

    const params: RequestParams = { repo: "clone", branch: "branch" };
    let data: any;

    await loadCommitData(params,
        (setdata: any) => {
            data = setdata;

            expect(data).toEqual({ dtest: "dtest" });
        }, () => { });


    jest.resetAllMocks();

});

test("Test calling invalid fetch", async () => {
    // global.fetch = jest.fn().mockImplementation(setupFetchStub({}))
    const response: any = jest.fn().mockResolvedValue({
        ok: false,
        text:  jest.fn().mockResolvedValue("error"),
    });

    global.fetch = jest.fn().mockImplementation(response);

    const params: RequestParams = { repo: "clone", branch: "branch" };
    let data: any;

    await performPrevis(params,
        () => { },
        (e: string) => {
            console.log(e);
            expect(e).toEqual("URL Error: error");
        });


    jest.resetAllMocks();

});
