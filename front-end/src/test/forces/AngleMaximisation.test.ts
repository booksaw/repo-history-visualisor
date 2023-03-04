import { forceSimulation } from "d3";
import { DirectoryData, LinkData, NodeData } from "../../components/NetworkDiagram";
import angleMaximisation from "../../forces/AngleMaximisation"


test("Test angle maximisation does not touch separated nodes", () => {
    const nodes: DirectoryData[] = [{ name: "a", x: 0, y: 0 }, { name: "b", x: 1, y: 0 }, { name: "c", x: 2, y: 0 }];
    const idIndexedNodes: { [key: string]: NodeData } = {
        a: { name: "a", x: 0, y: 0 },
        b: { name: "b", x: 1, y: 0 },
        c: { name: "c", x: 2, y: 0 }
    };

    const id: (node: NodeData) => string = (node: NodeData) => node.name;
    const links: LinkData[] = [
        new LinkData("a", "b"),
        new LinkData("b", "c"),
    ];

    const angleMax = angleMaximisation(links, nodes, idIndexedNodes, id);

    const f = forceSimulation().force("angleMax", angleMax).stop();
    f.tick(10);

    expect(nodes[0]).toEqual({ name: "a", x: 0, y: 0 });

})

test("Test angle maximisation handles overlapping nodes", () => {
    const nodes: NodeData[] = [{ name: "a", x: 0, y: 0 }, { name: "b", x: 1, y: 0 }, { name: "c", x: 0, y: 0.1 }];
    const idIndexedNodes: { [key: string]: NodeData } = {
        a: { name: "a", x: 0, y: 0 },
        b: { name: "b", x: 1, y: 0 },
        c: { name: "c", x: 0, y: 0.1 }
    };

    const id: (node: NodeData) => string = (node: NodeData) => node.name;
    const links: LinkData[] = [
        new LinkData("a", "b"),
        new LinkData("b", "c"),
    ];

    const angleMax = angleMaximisation(links, nodes, idIndexedNodes, id, 0.2, 0.15);

    const f = forceSimulation().force("angleMax", angleMax).stop();
    f.tick(10);

    console.log(idIndexedNodes);
    expect(idIndexedNodes["b"]).toEqual({ name: "b", x: 1, y: 0 });
    expect(idIndexedNodes["a"]).toEqual({
        name: "a", 
        x: 0, 
        y: 0, 
        angle: 0.09966865249116186,
        vx: 3.6617668874589374e-17,
        vy: 0.1993373049823237
    });
    expect(idIndexedNodes["c"]).toEqual({
        name: 'c',
        x: 0,
        y: 0.1,
        angle: 0,
        vx: -0.019834803185364312,
        vy: -0.198348031853643
    });
})