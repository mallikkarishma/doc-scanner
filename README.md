# Document AI Scanner

A full-stack web application that scans documents and ID cards, processes images, and automatically extracts text information using OCR and AI.

## Features

- Drag and drop file upload
- Image processing — grayscale, perspective correction, adaptive thresholding
- OCR text extraction using EasyOCR
- AI-powered structured data extraction using Groq LLaMA
- Auto-fill form with extracted information
- File metadata tracking with JSON storage

## Tech Stack

**Frontend**
- React

**Backend**
- FastAPI (Python)
- OpenCV
- EasyOCR
- Groq LLaMA 3.3

## Getting Started

### Prerequisites

- Node.js
- Python 3.8+
- Groq API key from https://console.groq.com

### Installation

Clone the repository

    git clone https://github.com/mallikkarishma/doc-scanner.git
    cd doc-scanner

Setup Backend

    cd backend
    pip install fastapi uvicorn opencv-python easyocr groq python-dotenv python-multipart numpy

Create a .env file inside the backend folder

    GROQ_API_KEY=your-api-key-here

Run the backend

    uvicorn main:app --reload

Setup Frontend

    cd ..
    npm install
    npm start

## Usage

1. Open http://localhost:3000 in your browser
2. Upload any document or ID card image
3. Select a processing mode — Grayscale, Deskew or Threshold
4. Click Process to apply image processing
5. Click Extract with AI to automatically extract and fill the form

## API Endpoints

POST /upload — Upload and save a file
POST /grayscale — Convert image to grayscale
POST /deskew — Straighten a tilted document
POST /threshold — Apply adaptive thresholding
POST /ocr — Extract raw text from image
POST /extract — Extract fields using Regex
POST /gemini — Extract fields using Groq AI

## Project Structure

doc-scanner/
├── src/
│   └── App.js
├── backend/
│   ├── main.py
│   ├── processor.py
│   ├── extractor.py
│   ├── uploads/
│   └── processed/
├── public/
└── README.md

## License

MIT