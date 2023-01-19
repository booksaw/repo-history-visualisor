import { useState } from "react";
import { Filechangetype, Repository } from "../RepositoryRepresentation";
import { addDirectory, getFileData, removeDirectory } from "../utils/RepositoryRepresentationUtils";
import NetworkDiagram, { DirectoryData, FileData, LinkData, NodeData } from "./NetworkDiagram";

export interface RepositoryVisualisorProps {
    visData: Repository;
    debugMode?: boolean;
    showFullPathOnHover?: boolean;
}

/**
 * parent component to the network diagram to act as an overarching controller and reduce the complexity of individual components
 * @param props Properties for this network diagram
 * @returns the function
 */
export default function RepositoryVisualisor(props: RepositoryVisualisorProps) {

    const [nodes, setNodes] = useState<DirectoryData[]>([{ name: "" }]);
    const [links, setLinks] = useState<LinkData[]>([]);

    const [indexedFileClusters, setIndexedFileClusters] = useState<{ [key: string]: string[] }>({});
    const [fileClusters, setFileClusters] = useState<FileData[]>([]);

    function addCommit() {
        if (!props.visData || props.visData.commits.length === 0) {
            console.log("No more commits to display");
            return;
        }

        const commit = props.visData.commits.shift()!;

        const newNodes: DirectoryData[] = [...nodes];
        const newLinks: LinkData[] = [...links];
        let newIndexedFileClusters: { [key: string]: string[] } = { ...indexedFileClusters };
        let newFileClusters: FileData[] = [...fileClusters];

        commit.c.forEach(change => {
            const fileData = getFileData(change.f);

            if (change.t === Filechangetype.ADDED) {
                // adding the containing directory
                addDirectory(newNodes, newLinks, { name: fileData.directory });

                // checking if the file already exsists (sometimes the same file can be created in multiple commits)
                if (newFileClusters.some(f => f.name === fileData.name && f.directory === fileData.directory)) {
                    // element already exists
                    return;
                }

                //  adding the new node
                newFileClusters.push(fileData);
                newIndexedFileClusters[fileData.directory] = [...newIndexedFileClusters[fileData.directory] ?? [], fileData.name];

            } else if (change.t === Filechangetype.DELETED) {
                // removing the existing node
                newFileClusters = newFileClusters.filter(fd => fd.name !== fileData.name || fd.directory !== fileData.directory);
                newIndexedFileClusters[fileData.directory] = newIndexedFileClusters[fileData.directory].filter(fd => fd !== fileData.name);

                const dir = newNodes.filter(n => n.name === fileData.directory)[0];
                if (dir) {
                    removeDirectory(newNodes, newLinks, newIndexedFileClusters, dir)
                }
            }

        });
        console.log("nodes = ", newNodes);
        console.log("links = ", newLinks);
        setNodes(newNodes);
        setLinks(newLinks);
        setFileClusters(newFileClusters);
        setIndexedFileClusters(newIndexedFileClusters);

    }

    return (
        <NetworkDiagram
            showDirectories={props.debugMode}
            showFullPathOnHover={props.showFullPathOnHover}
            links={links}
            nodes={nodes}
            onClick={addCommit}
            indexedFileClusters={indexedFileClusters}
            fileClusters={fileClusters}
        />
    );
}