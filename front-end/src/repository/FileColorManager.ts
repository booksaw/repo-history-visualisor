

class FileColorManager {

    // caching colors so they do not need to be recalculated
    colorLookup: { [key: string]: string } = {};

    getColorFromExtension(str: string): string {

        if (this.colorLookup[str]) {
            return this.colorLookup[str]
        }

        const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        const rgb = this.hexToRgb(color);
        if (!rgb || (rgb.r < 64 && rgb.g < 60 && rgb.b < 70)) {
            return this.getColorFromExtension(str);
        }

        this.colorLookup[str] = color;
        return color;

    }

    private hexToRgb(hex: string) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

}


export default new FileColorManager();
