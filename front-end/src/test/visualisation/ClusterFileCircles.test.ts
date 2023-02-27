import ClusterFileCircles from "../../visualisation/ClusterFileCircles";


test("Test get position vector of first ring", () => {
    const position = ClusterFileCircles.getPositionVector(0);

    expect(position).toEqual({x: 0, y: 0});

})

test("Test get position vector in second ring", () => {
    const position = ClusterFileCircles.getPositionVector(2);

    // precomputed to the correct value
    expect(position).toEqual({x: 5, y: -8.660254037844386});
});

test("Test get postion ring Id", () => {
    const id = ClusterFileCircles.getPositionRingId(2);

    expect(id).toEqual(2);

});

test("Test get postion ring Id for id 0", () => {
    const id = ClusterFileCircles.getPositionRingId(0);

    expect(id).toEqual(0);

});

test("Test getting combined circle radius", () => {
    const radius = ClusterFileCircles.getCombinedCircleRadius(2);

    expect(radius).toEqual(20);
})