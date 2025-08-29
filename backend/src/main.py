from fastapi import FastAPI

from views import router
from encryption import generate_aes_key
from service import save_aes_main_key, load_aes_main_key

app = FastAPI(root_path="/api", docs_url="/docs", openapi_url="/openapi.json")
app.include_router(router)

@app.on_event("startup")
async def startup_event():
    current_key = await load_aes_main_key()
    if not current_key:
        key = generate_aes_key()
        await save_aes_main_key(key)
        print("AES key generated and saved.")
    else:
        print("AES key already exists.")
