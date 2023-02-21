import { DirectoryData, FileData, LinkData, NodeData } from "../components/NetworkDiagram";
import { ValueSetterCombo, VariableDataProps } from "../repository/VisualisationVariableManager";

export class TestWrapperVariableDataProps { 
    props: VariableDataProps;

    constructor() {
        this.props = {
            contributors: new ValueSetterCombo({}, () => {}),
            date: new ValueSetterCombo<number | undefined>(0, () => {}),
            fileClusters: new ValueSetterCombo<FileData[]>([], () => {}), 
            indexedFileClusters: new ValueSetterCombo({}, () => {}),
            links: new ValueSetterCombo<LinkData[]>([], () => {}),
            milestone: new ValueSetterCombo<string | undefined>(undefined, () => {}),
            nodes: new ValueSetterCombo<DirectoryData[]>([], () => {})
        }
    }

}