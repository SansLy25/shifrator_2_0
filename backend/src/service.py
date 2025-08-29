async def save_aes_main_key(key_data: str) -> None:
    with open("../secrets/AES_main.key", "w", encoding="utf-8") as f:
        f.write(key_data)


async def load_aes_main_key() -> str:
    with open("../secrets/AES_main.key", "r", encoding="utf-8") as f:
        return f.read()