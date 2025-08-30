import { SmileCosmetic, getMaxCommonChar } from "./cosmetic.js";
import {base64ToArrayBuffer, arrayBufferToBase64} from "./base64.js";

function getCosmeticClassByVersion(version) {
    if (version === 1) {
        return SmileCosmetic;
    }
    throw new Error(`Unsupported version: ${version}`);
}

function encodeVersionByInvisibleSymbols(version) {
    let versionCypher = "";

    for (const char of version.toString(2)) {
        versionCypher += char === "1" ? '\u200b' : '\u200c'
    }

    return versionCypher;
}

function decodeVersionFromInvisibleSymbols(cypherText) {
    const invisibleChars = [];
    for (let i = cypherText.length - 1; i >= 0; i--) {
        const char = cypherText[i];
        if (char === '\u200b' || char === '\u200c') {
            invisibleChars.unshift(char);
        } else {
            break;
        }
    }

    if (invisibleChars.length === 0) {
        return 0;
    }

    let binaryString = "";
    for (const char of invisibleChars) {
        binaryString += char === '\u200b' ? '1' : '0';
    }


    return parseInt(binaryString, 2);
}

function extractCosmeticText(cypherWithCosmetic) {
    let cosmeticText = cypherWithCosmetic;
    for (let i = cypherWithCosmetic.length - 1; i >= 0; i--) {
        const char = cypherWithCosmetic[i];
        if (char === '\u200b' || char === '\u200c') {
            cosmeticText = cosmeticText.slice(0, -1);
        } else {
            break;
        }
    }
    return cosmeticText;
}

export async function customEncrypt(plainText, mainEncrypt, version = 0) {
    let cypherBase64 = await mainEncrypt(plainText);
    let cypherBytes = base64ToArrayBuffer(cypherBase64);

    const cosmeticInstance = new (getCosmeticClassByVersion(version))(cypherBytes);
    let messageText = cosmeticInstance.convertToCosmetic();

    const maxChar = cosmeticInstance.maxCharUsed;   // берём реально заменённый символ
    messageText += encodeVersionByInvisibleSymbols(version);
    messageText += maxChar;
    return messageText;
}

export async function customDecrypt(cypherWithCosmetic, mainDecrypt) {
    let maxChar = cypherWithCosmetic.at(-1);
    cypherWithCosmetic = cypherWithCosmetic.slice(0, -1);
    const version = decodeVersionFromInvisibleSymbols(cypherWithCosmetic);

    const cosmeticText = extractCosmeticText(cypherWithCosmetic)
    const cosmeticClass = getCosmeticClassByVersion(version);

    const cypherBytes = new cosmeticClass(null).extractData(cosmeticText + maxChar);

    const cypherBase64 = arrayBufferToBase64(cypherBytes);
    return await mainDecrypt(cypherBase64);
}

let text = "o23hmOxZi3vqhRc6mgk3XY8sVA+ZPBLcpU6I2dAJLzDFVEYK4qVqF/8TIRI="
console.log(text);
console.log(await customEncrypt(text, (t) => t, 1))
console.log(await customDecrypt(await customEncrypt(text, (t) => t, 1), (t) => t))
