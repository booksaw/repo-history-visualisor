import { Vector } from "./MathUtils";

// test the dot product produces the correct result
test("Test Dot Product", () => {

    const v1 = new Vector(1, 1);
    const v2 = new Vector(2, 1);

    const dot = Vector.dotProduct(v1, v2);
    
    expect(dot).toEqual(3);
});

// test that the determinant produces the expected result
test("Test determinant", () => {
    const v1 = new Vector(1, 1);
    const v2 = new Vector(2, 1);

    const determinant = Vector.determinant(v1, v2);
    
    expect(determinant).toEqual(-1);

});

// test that an acute angle is calcualted correctly
test("Test getAngleDifference with acute angle", () => {
    const v1 = new Vector(1, 1);
    const v2 = new Vector(-1, 1);

    const determinant = Vector.getAngleDifference(v1, v2);
    
    // as using PI result will not be exact so check result is close
    expect(determinant).toBeCloseTo(Math.PI / 2);
});


// test that an obtuse angle is calcualted correctly instead of 
// returning the alternate acute angle
test("Test getAngleDifference with acute angle", () => {
    const v1 = new Vector(-1, 1);
    const v2 = new Vector(1, 1);

    const determinant = Vector.getAngleDifference(v1, v2);
    
    // as using PI result will not be exact so check result is close
    expect(determinant).toBeCloseTo(Math.PI * 3 / 2);
});

// Test that fromModArg creates a vector of the correct values
test("Test fromModArg 0 angle", () => {
    const mod = 1;
    const arg = 0;

    const vector = Vector.fromModArg(mod, arg);

    expect(vector).toEqual(new Vector(1, 0));
});

// Test that fromModArg creates a vector of the correct values
// when an angle is given
test("Test fromModArg 0 angle", () => {
    const mod = 1;
    const arg = Math.PI / 2;

    const vector = Vector.fromModArg(mod, arg);

    // as using PI result will not be exact so check result is close
    expect(vector.x).toBeCloseTo(0);
    expect(vector.y).toBeCloseTo(1);
});

// test that vectors are subtracted correctly
test("Test Subtracting Vectors", () => {
    const v1 = new Vector(3, 1);
    const v2 = new Vector(2, 1);

    const result = Vector.subtract(v1, v2);

    expect(result).toEqual(new Vector(1, 0));
});

// test that vectors are added correctly
test("Test adding Vectors", () => {
    const v1 = new Vector(3, 1);
    const v2 = new Vector(2, 1);

    const result = Vector.add(v1, v2);

    expect(result).toEqual(new Vector(5, 2));
});

// test that vectors are subtracted correctly
test("Test Vector Modulus", () => {
    const v1 = new Vector(3, 4);
   
    const result = v1.modulus();

    expect(result).toEqual(5);
});

// test that vectors are subtracted correctly
test("Test Vector Modulus Squared", () => {
    const v1 = new Vector(3, 4);
   
    const result = v1.modulusSquared();

    expect(result).toEqual(25);
});

// test that vectors are subtracted correctly
test("Test Vector Argument", () => {
    const v1 = new Vector(0, 1);
   
    const result = v1.argument();

    // as using PI result will not be exact so check result is close
    expect(result).toBeCloseTo(Math.PI / 2);
});

// test that vectors are subtracted correctly
test("Test Vector clone", () => {
    const v1 = new Vector(0, 1);
   
    const clone = v1.clone();
    // changing v1 and ensuring clone does not update
    v1.x = 1;

    expect(clone).toEqual(new Vector(0, 1));
});

// test that vectors are subtracted correctly
test("Test Vector Scale", () => {
    const v1 = new Vector(2, 1);
   
    v1.scale(2);

    expect(v1).toEqual(new Vector(4, 2));
});
