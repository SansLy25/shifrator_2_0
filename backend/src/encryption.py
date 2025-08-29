import base64
import os

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes


def generate_aes_key():
    return base64.b64encode(os.urandom(32)).decode("utf-8")


def encrypt_aes_key_by_rsa(public_key_base64: str, aes_key: str) -> str:
    public_key_bytes = base64.b64decode(public_key_base64)
    public_key = serialization.load_pem_public_key(public_key_bytes)

    pem_public_key = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    print("Public Key in PEM format:")
    print(pem_public_key.decode('utf-8'))

    encrypted = public_key.encrypt(
        aes_key.encode(),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return base64.b64encode(encrypted).decode()

