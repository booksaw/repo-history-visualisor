import FileColorManager from "../../repository/FileColorManager";


test("Test consistent color of filetype", () => {
    const c1 = FileColorManager.getColorFromExtension("java");
    const c2 = FileColorManager.getColorFromExtension("java");

    expect(c1).toEqual(c2);
})
