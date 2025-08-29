from pydantic import BaseModel


class CiphertextSchema(BaseModel):
    ciphertext_base_64: str


class RSAPublicKeySchema(BaseModel):
    public_key_base64: str
