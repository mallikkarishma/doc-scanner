import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);

  function handleDrop(e) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    handleUpload(droppedFile);
  }

  async function handleUpload(selectedFile) {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    alert(data.message);
  }

  return (
    <div style={{ maxWidth: 500, margin: "80px auto", fontFamily: "Georgia, serif" }}>

      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Document Scanner</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>Upload your document or ID card to extract information automatically.</p>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "1.5px dashed #999",
          borderRadius: 10,
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 16, marginBottom: 12 }}>Drag and drop a file here</p>
        <p style={{ color: "#999", marginBottom: 16 }}>or</p>
        <input type="file" onChange={(e) => {
          setFile(e.target.files[0]);
          handleUpload(e.target.files[0]);
        }} />
      </div>

      {file && (
        <p style={{ marginTop: 24, fontSize: 15 }}>
          Selected: <strong>{file.name}</strong>
        </p>
      )}

    </div>
  );
}

export default App;