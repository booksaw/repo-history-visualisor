import { FileClusterLocations } from "./ClusterFileCircles"

test("Test get position vector of first ring", () => {
    const circles = new FileClusterLocations(); 
    const position = circles.getPositionVector(0);

    expect(position).toEqual({x: 0, y: 0});

})

test("Test get position vector in second ring", () => {
    const circles = new FileClusterLocations(); 
    const position = circles.getPositionVector(2);

    // precomputed to the correct value
    expect(position).toEqual({x: 5, y: -8.660254037844386});
});

test("Test get postion ring Id", () => {
    const circles = new FileClusterLocations(); 
    const id = circles.getPositionRingId(2);

    expect(id).toEqual(1);

});

test("Test get postion ring Id for id 0", () => {
    const circles = new FileClusterLocations(); 
    const id = circles.getPositionRingId(0);

    expect(id).toEqual(0);

});