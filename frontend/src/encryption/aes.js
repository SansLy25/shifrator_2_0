import {
    arrayBufferToBase64,
} from './base64.js';

export async function encryptAES256(plaintext, base64Key) {
    try {
        const keyData = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));

        const key = await window.crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'AES-GCM' },
            false,
            ['encrypt']
        );

        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        const encoder = new TextEncoder();
        const plaintextBytes = encoder.encode(plaintext);

        const ciphertext = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            plaintextBytes
        );

        const encryptedData = new Uint8Array(iv.length + ciphertext.byteLength);
        encryptedData.set(iv, 0);
        encryptedData.set(new Uint8Array(ciphertext), iv.length);

        return arrayBufferToBase64(encryptedData.buffer);

    } catch (error) {
        console.error('Ошибка шифрования:', error);
        throw error;
    }
}


export async function decryptAES256(encryptedBase64, base64Key) {
    try {
        const keyData = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));

        const key = await window.crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'AES-GCM' },
            false,
            ['decrypt']
        );

        const encryptedData = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

        const iv = encryptedData.slice(0, 12);
        const ciphertext = encryptedData.slice(12);

        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            ciphertext
        );

        const decoder = new TextDecoder();
        return decoder.decode(decrypted);

    } catch (error) {
        console.error('Ошибка дешифрования:', error);
        throw error;
    }
}