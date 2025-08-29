import {useState, useCallback} from 'react';
import {encryptAES256, decryptAES256} from './../encryption/aes.js';

export function useAsyncCrypto() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const encrypt = useCallback(async (text) => {
        if (!text.trim()) return '';

        setIsProcessing(true);
        setError(null);

        try {
            const aesKey = localStorage.getItem('AESKey');
            if (!aesKey) {
                throw new Error('AES ключ не найден');
            }
            return await encryptAES256(text, aesKey);
        } catch (err) {
            setError(err.message);
            return '';
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const decrypt = useCallback(async (text) => {
        if (!text.trim()) return '';

        setIsProcessing(true);
        setError(null);

        try {
            const aesKey = localStorage.getItem('AESKey');
            if (!aesKey) {
                throw new Error('AES ключ не найден');
            }
            return await decryptAES256(text, aesKey);
        } catch (err) {
            setError(err.message);
            return '';
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return {encrypt, decrypt, isProcessing, error};
}