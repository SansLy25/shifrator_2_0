import {utf8ToBase64, arrayBufferToBase64, base64ToUtf8, formatBase64} from "./base64.js";

export default async function generateCompatibleRSAKeys() {
    try {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: { name: "SHA-256" },
            },
            true,
            ["encrypt", "decrypt"]
        );

        const [publicKeySpki, privateKeyPkcs8] = await Promise.all([
            window.crypto.subtle.exportKey("spki", keyPair.publicKey),
            window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
        ]);

        const publicKeyPem = spkiToPem(publicKeySpki);
        const privateKeyPem = pkcs8ToPem(privateKeyPkcs8);

        return {
            keyPair,
            publicKeyPem,
            privateKeyPkcs8,
            publicKeyBase64: utf8ToBase64(publicKeyPem),
            privateKeyBase64: utf8ToBase64(privateKeyPem)
        };
    } catch (error) {
        console.error('Ошибка генерации ключей:', error);
        throw error;
    }
}

export async function decryptRSA(secretKey, ciphertext) {
    try {
        const privateKey = await window.crypto.subtle.importKey(
            "pkcs8",
            secretKey,
            {
                name: "RSA-OAEP",
                hash: { name: "SHA-256" }
            },
            true,
            ["decrypt"]
        );

        const binaryString = atob(ciphertext);
        const ciphertextBuffer = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            ciphertextBuffer[i] = binaryString.charCodeAt(i);
        }

        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            ciphertextBuffer
        );

        const decryptedBase64 = arrayBufferToBase64(decryptedData);
        return base64ToUtf8(decryptedBase64);

    } catch (error) {
        console.error("Ошибка при расшифровке:", error);
        throw error;
    }
}

function spkiToPem(spkiBuffer) {
    const base64 = arrayBufferToBase64(spkiBuffer);
    return formatBase64(`-----BEGIN PUBLIC KEY-----\n${base64}\n-----END PUBLIC KEY-----`);
}

function pkcs8ToPem(pkcs8Buffer) {
    const base64 = arrayBufferToBase64(pkcs8Buffer);
    return formatBase64(`-----BEGIN PRIVATE KEY-----\n${base64}\n-----END PRIVATE KEY-----`);
}

