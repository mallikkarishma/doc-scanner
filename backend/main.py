from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import json
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Save the file
    with open(f"uploads/{file.filename}", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save metadata to JSON
    metadata = {
        "filename": file.filename,
        "uploaded_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    # Load existing data and add new entry
    if os.path.exists("metadata.json"):
        with open("metadata.json", "r") as f:
            data = json.load(f)
    else:
        data = []

    data.append(metadata)

    with open("metadata.json", "w") as f:
        json.dump(data, f, indent=2)

    return {"message": "File uploaded successfully", "filename": file.filename}