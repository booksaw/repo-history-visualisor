/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
import RepositoryVisualisor from "../../components/RepositoryVisualiser";
import * as NetworkDiagram from "../../components/NetworkDiagram";
import { NetworkDiagramProps } from "../../components/NetworkDiagram";
import RepositoryDataManager from "../../repository/RepositoryDataManager";
import { SpeedOptions } from "../../visualisation/VisualisationSpeedOptions";

afterEach(() => {
    jest.restoreAllMocks();
});

test("Test with blank vis data", () => {

    jest.spyOn(NetworkDiagram, "default").mockReturnValue(<></>);

    render(<RepositoryVisualisor repoDataManager={new RepositoryDataManager({})} speed={SpeedOptions.NORMAL} />)

});

test("Test triggering the tick function without commits", () => {

    let tickFunction: any;

    jest.spyOn(NetworkDiagram, "default").mockImplementation(
        (props: NetworkDiagramProps) => {
            tickFunction = props.tick;
            return <></>
        }
    );
    render(<RepositoryVisualisor repoDataManager={new RepositoryDataManager({})} speed={SpeedOptions.NORMAL} />)

    expect(tickFunction).toBeDefined();

    tickFunction();

});
