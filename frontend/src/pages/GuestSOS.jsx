import { useState } from "react"
import axios from "axios"

export default function GuestSOS() {
  const [form, setForm] = useState({
    guest_name: "",
    room_number: "",
    location: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await axios.post("https://crisis-sync.onrender.com/sos", form)
      setResult(res.data)
    } catch (err) {
      setError("Failed to send SOS. Please try again.")
    }
    setLoading(false)
  }

  const severityColor = (s) => {
    if (s === "Critical") return "badge-critical"
    if (s === "High") return "badge-high"
    if (s === "Medium") return "badge-medium"
    return "badge-low"
  }

  return (
    <div className="container">
      <div className="card">
        <h2>🆘 Emergency SOS</h2>

        <div className="form-group">
          <label>Your Name</label>
          <input
            name="guest_name"
            placeholder="e.g. John Smith"
            value={form.guest_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Room Number</label>
          <input
            name="room_number"
            placeholder="e.g. 204"
            value={form.room_number}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Your Location</label>
          <input
            name="location"
            placeholder="e.g. Room 204, second floor"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Describe the Emergency</label>
          <textarea
            name="description"
            placeholder="e.g. Someone is having a heart attack..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <button
          className="sos-btn"
          onClick={handleSubmit}
          disabled={loading || !form.guest_name || !form.description}
        >
          {loading ? "SENDING SOS..." : "🚨 SEND SOS"}
        </button>

        {error && (
          <p style={{ color: "#f43f5e", marginTop: "1rem" }}>{error}</p>
        )}

        {result && (
          <div className="success-box">
            <h3>✅ SOS Received — Help is on the way</h3>
            <div className="info-row" style={{ marginTop: "0.8rem" }}>
              <span className={`badge ${severityColor(result.severity)}`}>
                {result.severity}
              </span>
              <span className="badge badge-medical">{result.crisis_type}</span>
              {result.should_call_911 && (
                <span className="badge badge-fire">911 Alerted</span>
              )}
            </div>
            <p className="alert-instructions">{result.staff_instructions}</p>
            <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
              Estimated response: {result.estimated_response_time}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}