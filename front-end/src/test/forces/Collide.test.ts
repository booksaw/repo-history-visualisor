import assert from "assert";
import { forceSimulation } from "d3";
import { DirectoryData } from "../../components/NetworkDiagram";
import Collide from "../../forces/Collide";
import { assertNodeEqual } from "./assert";

it("forceCollide collides nodes", () => {
    const collide = Collide(1);
    const f = forceSimulation().force("collide", collide).stop();
    const a: DirectoryData = { name: "testa", x: 0, y: 0 }, b: DirectoryData = { name: "testb", x: 0, y: 0 }, c: DirectoryData = { name: "testc", x: 0, y: 0 };
    f.nodes([a, b, c]);
    f.tick(10);
    console.log("a = ", a)
    assertNodeEqual(a, {
        name: 'testa',
        x: -0.0012835847657054027,
        y: 0.00036913994399354034,
        index: 0,
        vy: 0.000240941492500424,
        vx: -0.0008360157668464426
    });
    collide.radius(100);
    f.tick(10);
    assertNodeEqual(a, {
        name: 'testa',
        x: 10.60749699199842,
        y: 10.855421634071034,
        index: 0,
        vy: 1.2,
        vx: 1.2
    });
});


it("forceCollide respects fixed positions", () => {
    const collide = Collide(1);
    const f = forceSimulation().force("collide", collide).stop();
    const a: DirectoryData = { name: "testa", x: 0, y: 0, fx: 0, fy: 0 }, b: DirectoryData = { name: "testb", x: 0, y: 0 }, c: DirectoryData = { name: "testc", x: 0, y: 0 };
    f.nodes([a, b, c]);
    f.tick(10);
    assertNodeEqual(a, { fx: 0, fy: 0, index: 0, x: 0, y: 0, vy: 0, vx: 0 });
    collide.radius(100);
    f.tick(10);
    assertNodeEqual(a, { fx: 0, fy: 0, index: 0, x: 0, y: 0, vy: 0, vx: 0 });
});

it("forceCollide jiggles equal positions", () => {
    const collide = Collide(1);
    const f = forceSimulation().force("collide", collide).stop();
    const a: DirectoryData = { x: 0, y: 0, name: "testc" }, b: DirectoryData = { x: 0, y: 0, name: "testc" };
    f.nodes([a, b]);
    f.tick();
    assert(a.x !== b.x);
    assert(a.y !== b.y);
    assert.strictEqual(a.vx, -b.vx!);
    assert.strictEqual(a.vy, -b.vy!);
});

it("forceCollide jiggles in a reproducible way", () => {
    const nodes: DirectoryData[] = Array.from({ length: 10 }, () => ({ name: "test", x: 0, y: 0 }));
    forceSimulation().nodes(nodes).force("collide", Collide(1)).stop().tick(50);
    console.log(nodes[0]);
    assertNodeEqual(nodes[0], { 
        name: 'test',
        x: 0.5099319152061704,
        y: -0.21898739016287636,
        index: 0,
        vy: -9.704284301337091e-11,
        vx: 1.0300501268553792e-10
     });
});