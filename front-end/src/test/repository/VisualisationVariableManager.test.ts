import { Milestone } from "../../repository/RepositoryRepresentation";
import { ValueSetterCombo, VisualisationVariableManager, VariableDataProps } from "../../repository/VisualisationVariableManager";
import { TestWrapperVariableDataProps } from "../VariableDataPropsTestUtils";

test("Test single ValueSetterCombo", () => {
    const value = { value: false }

    const combo = new ValueSetterCombo(value, () => { value.value = true })
    combo.applyValue();

    expect(value).toEqual({ value: true })

});

test("Test trigger setters", () => {
    let applied = false;

    const props = new TestWrapperVariableDataProps();
    props.props.milestone = new ValueSetterCombo<Milestone | undefined>(undefined, () => { applied = true })

    const manager = new VisualisationVariableManager(props.props);
    manager.triggerSetters();

    expect(applied).toEqual(true);
});

test("Test set props", () => {

    const propsOld = new TestWrapperVariableDataProps();
    const propsNew = new TestWrapperVariableDataProps();

    const manager = new VisualisationVariableManager(propsOld.props);
    manager.setProps(propsNew.props);

    expect(manager.props).toEqual(propsNew.props);
});

test("Test creating tick function", () => {
    let setvalue = null;

    const props = new TestWrapperVariableDataProps();
    props.props.milestone.setter = (value: Milestone | undefined) => { setvalue = value }

    const manager = new VisualisationVariableManager(props.props);
    const fn = manager.getTickFunction((props: VariableDataProps) => { props.milestone.value = {commitHash: "AA", milestone: "test", commitID: 1}});
    fn();

    expect(setvalue).toEqual({"commitHash": "AA", "commitID": 1, "milestone": "test"});
});