import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [original, setOriginal] = useState(null);
  const [processed, setProcessed] = useState(null);
  const [activeTab, setActiveTab] = useState("grayscale");
  const [loading, setLoading] = useState(false);

  function handleFile(selectedFile) {
    setFile(selectedFile);
    setOriginal(URL.createObjectURL(selectedFile));
    setProcessed(null);
  }

  async function handleProcess() {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setProcessed(null);

    const response = await fetch(`http://127.0.0.1:8000/${activeTab}`, {
      method: "POST",
      body: formData,
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setProcessed(url);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 800, margin: "60px auto", fontFamily: "Georgia, serif" }}>

      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Document Scanner</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>Upload your document or ID card to extract information automatically.</p>

      {/* Upload Box */}
      <div
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "1.5px dashed #999",
          borderRadius: 10,
          padding: "40px 20px",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <p style={{ fontSize: 16, marginBottom: 12 }}>Drag and drop a file here</p>
        <p style={{ color: "#999", marginBottom: 16 }}>or</p>
        <input type="file" onChange={(e) => handleFile(e.target.files[0])} />
      </div>

      {/* Tab Box */}
      {file && (
        <div style={{ border: "1.5px solid #ddd", borderRadius: 10, marginBottom: 24, overflow: "hidden" }}>
          
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1.5px solid #ddd" }}>
            {["grayscale", "deskew", "threshold"].map((tab) => (
              <div
                key={tab}
                onClick={() => { setActiveTab(tab); setProcessed(null); }}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  textAlign: "center",
                  cursor: "pointer",
                  fontFamily: "Georgia, serif",
                  fontSize: 14,
                  fontWeight: activeTab === tab ? "bold" : "normal",
                  background: activeTab === tab ? "#f5f5f5" : "white",
                  borderBottom: activeTab === tab ? "2px solid black" : "none",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: 20 }}>
            {activeTab === "grayscale" && <p style={{ color: "#666", fontSize: 13 }}>Converts your image to black and white. Good for removing color noise.</p>}
            {activeTab === "deskew" && <p style={{ color: "#666", fontSize: 13 }}>Straightens a tilted document image automatically.</p>}
            {activeTab === "threshold" && <p style={{ color: "#666", fontSize: 13 }}>Cleans up the document background for better text reading.</p>}

            <button
              onClick={handleProcess}
              style={{
                marginTop: 12,
                padding: "10px 28px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              {loading ? "Processing..." : "Process"}
            </button>
          </div>
        </div>
      )}

      {/* Images */}
      {original && (
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: 8, fontWeight: "bold" }}>Original</p>
            <img src={original} alt="original"
              style={{ width: "100%", borderRadius: 10, border: "1px solid #eee" }} />
          </div>

          {processed && (
            <div style={{ flex: 1 }}>
              <p style={{ marginBottom: 8, fontWeight: "bold" }}>Processed</p>
              <img src={processed} alt="processed"
                style={{ width: "100%", borderRadius: 10, border: "1px solid #eee" }} />
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default App;