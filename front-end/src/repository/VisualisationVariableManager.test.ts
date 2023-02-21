import { TestWrapperVariableDataProps } from "../test/VariableDataPropsTestUtils";
import { ValueSetterCombo, VariableDataProps, VisualisationVariableManager } from "./VisualisationVariableManager";

test("Test single ValueSetterCombo", () => {
    const value = { value: false }

    const combo = new ValueSetterCombo(value, () => { value.value = true })
    combo.applyValue();

    expect(value).toEqual({ value: true })

});

test("Test trigger setters", () => {
    let applied = false;

    const props = new TestWrapperVariableDataProps();
    props.props.milestone = new ValueSetterCombo<string | undefined>(undefined, () => { applied = true })

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
    props.props.milestone.setter = (value: string | undefined) => { setvalue = value }

    const manager = new VisualisationVariableManager(props.props);
    const fn = manager.getTickFunction((props: VariableDataProps) => { props.milestone.value = "test"})
    fn();

    expect(setvalue).toEqual("test");
});