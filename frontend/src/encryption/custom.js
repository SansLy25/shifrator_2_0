import {SmileCosmetic} from "./cosmetic.js";
import {base64ToArrayBuffer, arrayBufferToBase64} from "./base64.js";


let FIRST_INVISIBLE_SYMBOL, SECOND_INVISIBLE_SYMBOL;


FIRST_INVISIBLE_SYMBOL = '\ufeff'
SECOND_INVISIBLE_SYMBOL = '\u2061'


function getCosmeticClassByVersion(version) {
    if (version === 1) {
        return SmileCosmetic;
    }
    throw new Error(`Unsupported version: ${version}`);
}

function encodeVersionByInvisibleSymbols(version) {
    let versionCypher = "";

    for (const char of version.toString(2)) {
        versionCypher += char === "1" ? FIRST_INVISIBLE_SYMBOL : SECOND_INVISIBLE_SYMBOL
    }

    return versionCypher;
}

function decodeVersionFromInvisibleSymbols(cypherText) {
    const invisibleChars = [];
    for (let i = cypherText.length - 1; i >= 0; i--) {
        const char = cypherText[i];
        if (char === FIRST_INVISIBLE_SYMBOL || char === SECOND_INVISIBLE_SYMBOL) {
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
        binaryString += char === FIRST_INVISIBLE_SYMBOL ? '1' : '0';
    }


    return parseInt(binaryString, 2);
}

function extractCosmeticText(cypherWithCosmetic) {
    let cosmeticText = cypherWithCosmetic;
    for (let i = cypherWithCosmetic.length - 1; i >= 0; i--) {
        const char = cypherWithCosmetic[i];
        if (char === FIRST_INVISIBLE_SYMBOL || char === SECOND_INVISIBLE_SYMBOL) {
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

    return messageText + encodeVersionByInvisibleSymbols(version) + "\u2061";
}

export async function customDecrypt(cypherWithCosmetic, mainDecrypt) {
    cypherWithCosmetic = cypherWithCosmetic.slice(0, -1);

    const version = decodeVersionFromInvisibleSymbols(cypherWithCosmetic);
    const cosmeticText = extractCosmeticText(cypherWithCosmetic);

    const cosmeticClass = getCosmeticClassByVersion(version);
    const cypherBytes = new cosmeticClass(null).extractData(cosmeticText);

    const cypherBase64 = arrayBufferToBase64(cypherBytes);
    return await mainDecrypt(cypherBase64);
}

