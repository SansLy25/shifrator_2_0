from fastapi import APIRouter, HTTPException

from schemas import RSAPublicKeySchema, CiphertextSchema
from encryption import encrypt_aes_key_by_rsa
from service import load_aes_main_key

router = APIRouter()


@router.post("/algorithms/rsa/encrypt_aes_key", tags=["RSA"])
async def encrypt_aes_key(key_schema: RSAPublicKeySchema) -> CiphertextSchema:
    try:
        aes_key = await load_aes_main_key()
        encrypted_key = encrypt_aes_key_by_rsa(key_schema.public_key_base64, aes_key)
        return CiphertextSchema(ciphertext_base_64=encrypted_key)
    except Exception as e:
        raise HTTPException(400, f"Encryption failed: {str(e)}")



