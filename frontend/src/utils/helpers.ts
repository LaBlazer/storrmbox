export function createPseudoGenerator(seed: number) {
    return function () {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
}

export function stringToNumber(str: string) {
    let number = 1;
    for (let i = 0; i < str.length; i++) {
        number += str.charCodeAt(i);
    }
    return number;
}

/**
 * Generate random colors based on string
 *
 * @export
 * @param {string} str
 * @returns {[number, number, number]}
 */
export function generateRGBColorsFromString(str: string): [number, number, number] {
    let seed = stringToNumber(str);

    let generator = createPseudoGenerator(seed);
    let r = Math.round(generator() * 255);
    let g = Math.round(generator() * 255);
    let b = Math.round(generator() * 255);

    return [r, g, b];
}

export function colorsToCSSRule([r, g, b]: [number, number, number]) {
    return `rgb(${r}, ${g}, ${b})`;
}