import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [original, setOriginal] = useState(null);
  const [processed, setProcessed] = useState(null);
  const [activeTab, setActiveTab] = useState("grayscale");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    branch: "",
    roll_no: "",
    student_no: "",
  });

  function handleFile(selectedFile) {
    setFile(selectedFile);
    setOriginal(URL.createObjectURL(selectedFile));
    setProcessed(null);
    setFormData({ name: "", course: "", branch: "", roll_no: "", student_no: "" });
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

  async function handleExtract() {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    setExtracting(true);
    const response = await fetch("http://127.0.0.1:8000/gemini", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    setFormData({
      name: result.name || "",
      course: result.course || "",
      branch: result.branch || "",
      roll_no: result.roll_no || "",
      student_no: result.student_no || "",
    });
    setExtracting(false);
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
          <div style={{ padding: 20 }}>
            {activeTab === "grayscale" && <p style={{ color: "#666", fontSize: 13 }}>Converts your image to black and white.</p>}
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
        <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: 8, fontWeight: "bold" }}>Original</p>
            <img src={original} alt="original" style={{ width: "100%", borderRadius: 10, border: "1px solid #eee" }} />
          </div>
          {processed && (
            <div style={{ flex: 1 }}>
              <p style={{ marginBottom: 8, fontWeight: "bold" }}>Processed</p>
              <img src={processed} alt="processed" style={{ width: "100%", borderRadius: 10, border: "1px solid #eee" }} />
            </div>
          )}
        </div>
      )}

      {/* Extract Button */}
      {file && (
        <button
          onClick={handleExtract}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "#1a1a2e",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: "bold",
            cursor: "pointer",
            fontFamily: "Georgia, serif",
            marginBottom: 24,
          }}
        >
          {extracting ? "Extracting..." : "Extract with AI"}
        </button>
      )}

      {/* Auto Fill Form */}
      {formData.name && (
        <div style={{ border: "1.5px solid #ddd", borderRadius: 10, padding: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 20 }}>Extracted Information</h2>
          {[
            { label: "Name", key: "name" },
            { label: "Course", key: "course" },
            { label: "Branch", key: "branch" },
            { label: "Roll No", key: "roll_no" },
            { label: "Student No", key: "student_no" },
          ].map(({ label, key }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>{label}</label>
              <input
                value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1.5px solid #ddd",
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: "Georgia, serif",
                }}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default App;