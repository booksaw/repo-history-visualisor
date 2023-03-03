import { render } from "@testing-library/react";
import App from "../../components/App";

beforeEach(() => {
    jest.doMock("../../components/CloneForm", () => {
        const component = () => <></>;
        return component;
    });
    jest.doMock("react-spinners", () => {
        const component = () => <></>;
        return component;
    });
    jest.doMock("../../components/RepositoryVisualiser", () => {
        const component = () => <></>;
        return component;
    });
});

test("Test displaying the app without errors", () => {
    render(<App/>)
});