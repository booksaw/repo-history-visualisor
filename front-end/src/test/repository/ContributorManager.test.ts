import { DirectoryData, FileData } from "../../components/NetworkDiagram";
import { ContributorProps } from "../../components/RepositoryVisualisor";
import { TestWrapperVariableDataProps } from "../VariableDataPropsTestUtils";
import { Vector } from "../../utils/MathUtils";
import ContributorManager from "../../repository/ContributorManager"

test("Test created contributor move function", () => {
    const contributor: ContributorProps = { name: "testa", x: 0, y: 0 }
    const variableProps = new TestWrapperVariableDataProps();
    variableProps.props.contributors.value = { "testa": contributor };

    const fn = ContributorManager.getContributorMoveFunction({
        author: "testa", changes: [], timestamp: 0,
        commitHash: "AAAAA", commitId: 0
    }, new Vector(1, 1));
    fn(variableProps.props);

    expect(contributor.x).toEqual(1);
    expect(contributor.y).toEqual(1);

})

test("Test calculate change per tick", () => {


    const change = ContributorManager.calculateChangePerTick(new Vector(0, 0), { name: "", x: 1, y: 1 }, 1);

    expect(change.x).toEqual(-1);
    expect(change.y).toEqual(-1);
});

test("Test get commit contributor location", () => {

    const fd: FileData[] = [
        {changeType: "A", color: "w", directory: "test", name: "test"},
        {changeType: "A", color: "w", directory: "test1", name: "test"}
    ];
    const nodes: DirectoryData[] = [
        {name: "test", x: 0, y: 0},
        {name: "test1", x: 2, y: 2},
    ];

    const loc = ContributorManager.getCommitContributorLocation(fd, nodes);

    expect(loc.x).toEqual(1);
    expect(loc.y).toEqual(1);

})