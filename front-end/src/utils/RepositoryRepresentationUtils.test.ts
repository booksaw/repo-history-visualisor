/**
 * @jest-environment jsdom
 */
import { getColorFromExtension } from "./RepositoryRepresentationUtils"


test("Test consistent color of filetype", () => {
    const c1 = getColorFromExtension("java");
    const c2 = getColorFromExtension("java");

    expect(c1).toEqual(c2);
})