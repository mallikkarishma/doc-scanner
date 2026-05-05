from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import os
import json
from datetime import datetime
import cv2
from processor import ImageProcessor
import easyocr
from groq import Groq
from extractor import extract_fields
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
processor = ImageProcessor()
reader = easyocr.Reader(['en'])
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
os.makedirs("processed", exist_ok=True)

METADATA_FILE = "metadata.json"
if not os.path.exists(METADATA_FILE):
    with open(METADATA_FILE, "w") as f:
        json.dump([], f)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    with open(METADATA_FILE, "r") as f:
        metadata = json.load(f)

    metadata.append({
        "filename": file.filename,
        "uploaded_at": datetime.now().isoformat()
    })

    with open(METADATA_FILE, "w") as f:
        json.dump(metadata, f, indent=4)

    return {"filename": file.filename, "message": "File uploaded successfully"}

@app.post("/grayscale")
async def grayscale(file: UploadFile = File(...)):
    input_path = f"uploads/{file.filename}"
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = cv2.imread(input_path)
    result = processor.grayscale(image)

    output_path = f"processed/gray_{file.filename}"
    cv2.imwrite(output_path, result)

    return FileResponse(output_path, media_type="image/jpeg")

@app.post("/deskew")
async def deskew(file: UploadFile = File(...)):
    input_path = f"uploads/{file.filename}"
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = cv2.imread(input_path)
    result = processor.deskew(image)

    output_path = f"processed/deskew_{file.filename}"
    cv2.imwrite(output_path, result)

    return FileResponse(output_path, media_type="image/jpeg")

@app.post("/threshold")
async def threshold(file: UploadFile = File(...)):
    input_path = f"uploads/{file.filename}"
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = cv2.imread(input_path)
    result = processor.threshold(image)

    output_path = f"processed/thresh_{file.filename}"
    cv2.imwrite(output_path, result)

    return FileResponse(output_path, media_type="image/jpeg")

@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    input_path = f"uploads/{file.filename}"
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = reader.readtext(input_path)
    text = " ".join([result[1] for result in results])

    return {"text": text}

@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    input_path = f"uploads/{file.filename}"
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = reader.readtext(input_path)
    text = " ".join([result[1] for result in results])

    fields = extract_fields(text)

    return {"raw_text": text, "extracted": fields}

@app.post("/gemini")
async def gemini_extract(file: UploadFile = File(...)):
    input_path = f"uploads/{file.filename}"
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = reader.readtext(input_path)
    text = " ".join([result[1] for result in results])

    prompt = f"""
    Extract the following fields from this ID card text and return ONLY a JSON object:
    - name
    - course
    - branch
    - roll_no
    - student_no

    Text: {text}

    Return only the JSON object, nothing else.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    clean = response.choices[0].message.content.strip().replace("```json", "").replace("```", "").strip()
    data = json.loads(clean)

    return data