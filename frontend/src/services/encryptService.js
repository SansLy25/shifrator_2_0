import apiClient from "./httpClient.js";

export const getEncryptedAESKey = async (RSAPublicKey) => {
    try {
        return (await apiClient.post('/api/algorithms/rsa/encrypt_aes_key', {
            public_key_base64: RSAPublicKey,
        })).ciphertext_base_64
    } catch (error) {
        throw new Error("Что пошло не так при получения ключа шифрования")
    }
}