/**
 * Class for vector functions 
 */
export class Vector {
    x: number;
    y: number;

    /**
    * Caclulates the dot product of 2 vectors 
    * @param a the first vector 
    * @param b the second vector 
    * @returns the dot product
    */
    static dotProduct(a: Vector, b: Vector): number {
        return a.x * b.x + a.y * b.y;
    }

    /**
    * Calculates the determiniant of a vector
    * @param a the first vector 
    * @param b the second vector  
    * @returns the determinant
    */
    static determinant(a: Vector, b: Vector): number {
        return a.x * b.y - a.y * b.x;
    }

    /**
     * calculates the angle between v1 and v2 between 0 and 2PI radians
     * @param v1 Vector 1 
     * @param v2 Vector 2
     * @returns the calculated angle in radians 
     */
    static getAngleDifference(v1: Vector, v2: Vector): number {
        return Math.atan2(-Vector.determinant(v1, v2), -Vector.dotProduct(v1, v2)) + Math.PI
    }

    /**
     * conversts a vector in modulus argument form to be a vector object
     * @param mod The modulus of the vector
     * @param arg The argument of the vector
     * @returns The created vector object
     */
    static fromModArg(mod: number, arg: number): Vector {
        return new Vector(mod * Math.cos(arg), mod * Math.sin(arg));
    }

    /**
     * Used to perform v1-v2 and return result in a new vector
     * @param v1 The first vector 
     * @param v2 The second vector
     * @returns The result of the subtraction
     */
    static subtract(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    /**
     * Used to perform v1 + v2 and return the result in a new vector
     * @param v1 The first vector
     * @param v2 The second vector
     * @returns The result of the addition
     */
    static add(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }

    /**
     * Create a new vector from an x and y
     * @param x The x of the new vector
     * @param y The y of the new vector
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
    * Calculates the modulus of a vector 
    * @param a the vector 
    * @returns the modulus
    */
    modulus(): number {
        return Math.sqrt(this.modulusSquared());
    }

    /**
    * Calculates the squared modulus of a vector (used if the root of the modulus is not required)
    * @param a the vector
    * @returns the squared modulus
    */
    modulusSquared(): number {
        return this.x ** 2 + this.y ** 2;
    }

    /**
     * Calcultes the argument of the vector (between 0 and 2PI)
     * @returns The argument of the vector
     */
    getArgument() {
        return Math.atan2(-this.y, -this.x) + Math.PI;
    }

    /**
     * Create a clone of the vector, so it can be modified without changing the original
     * @returns The created clone
     */
    clone(): Vector {
        return new Vector(this.x, this.y);
    }

    /**
     * Scale this vector by the given parameters
     * @param scaler The scaped vector
     */
    scale(scaler: number) {
        this.x *= scaler;
        this.y *= scaler;
    }


}
