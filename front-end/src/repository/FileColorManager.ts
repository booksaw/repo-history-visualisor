

class FileColorManager {

    // caching colors so they do not need to be recalculated
    colorLookup: { [key: string]: string } = {};

    getColorFromExtension(str: string) {

        if (this.colorLookup[str]) {
            return this.colorLookup[str]
        }

        const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        this.colorLookup[str] = color;
        return color;

    }


}


export default new FileColorManager();
