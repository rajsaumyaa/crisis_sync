import { useState, useEffect } from "react"
import axios from "axios"

export default function StaffDashboard() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState({})
  const [reportLoading, setReportLoading] = useState({})

  const fetchAlerts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/alerts")
      setAlerts(res.data.reverse())
    } catch (err) {
      console.error("Failed to fetch alerts")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 3000)
    return () => clearInterval(interval)
  }, [])

  const resolveAlert = async (id) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/alerts/${id}/resolve`)
      fetchAlerts()
    } catch (err) {
      console.error("Failed to resolve alert")
    }
  }

  const generateReport = async (id) => {
    setReportLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await axios.post(`http://127.0.0.1:8000/alerts/${id}/report`)
      setReports((prev) => ({ ...prev, [id]: res.data.report }))
    } catch (err) {
      setReports((prev) => ({ ...prev, [id]: "Failed to generate report." }))
    }
    setReportLoading((prev) => ({ ...prev, [id]: false }))
  }

  const severityClass = (s) => {
    if (s === "Critical") return "critical"
    if (s === "High") return "high"
    if (s === "Medium") return "medium"
    return "low"
  }

  const severityBadge = (s) => {
    if (s === "Critical") return "badge-critical"
    if (s === "High") return "badge-high"
    if (s === "Medium") return "badge-medium"
    return "badge-low"
  }

  const activeAlerts = alerts.filter((a) => a.status === "active")
  const resolvedAlerts = alerts.filter((a) => a.status === "resolved")

  return (
    <div className="container">
      <div className="card">
        <h2>🖥️ Staff Command Dashboard</h2>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Auto-refreshes every 3 seconds
        </p>

        {loading && (
          <p className="empty-state">Loading alerts...</p>
        )}

        {!loading && activeAlerts.length === 0 && resolvedAlerts.length === 0 && (
          <p className="empty-state">✅ No active emergencies</p>
        )}

        {activeAlerts.length > 0 && (
          <>
            <h3 style={{ color: "#f43f5e", marginBottom: "1rem" }}>
              🔴 Active Alerts ({activeAlerts.length})
            </h3>
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-card ${severityClass(alert.severity)}`}
              >
                <div className="alert-header">
                  <div className="info-row">
                    <span className={`badge ${severityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="badge badge-medical">{alert.crisis_type}</span>
                    {alert.should_call_911 && (
                      <span className="badge badge-fire">📞 Call 911</span>
                    )}
                  </div>
                  <button
                    className="resolve-btn"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Mark Resolved
                  </button>
                </div>

                <p className="alert-meta">
                  👤 {alert.guest_name} &nbsp;|&nbsp; 🚪 Room {alert.room_number} &nbsp;|&nbsp; 📍 {alert.location}
                </p>
                <p className="alert-meta">
                  🕐 {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
                <p className="alert-instructions">{alert.staff_instructions}</p>
                <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                  ⏱ ETA: {alert.estimated_response_time}
                </p>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  "{alert.description}"
                </p>
              </div>
            ))}
          </>
        )}

        {resolvedAlerts.length > 0 && (
          <>
            <h3 style={{ color: "#22c55e", margin: "1.5rem 0 1rem" }}>
              ✅ Resolved ({resolvedAlerts.length})
            </h3>
            {resolvedAlerts.map((alert) => (
              <div key={alert.id} className="alert-card" style={{ opacity: 0.7 }}>
                <div className="alert-header">
                  <div className="info-row">
                    <span className="badge badge-resolved">Resolved</span>
                    <span className="badge badge-medical">{alert.crisis_type}</span>
                    <span className={`badge ${severityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <button
                    className="resolve-btn"
                    style={{ background: "#1d4ed8" }}
                    onClick={() => generateReport(alert.id)}
                    disabled={reportLoading[alert.id]}
                  >
                    {reportLoading[alert.id] ? "Generating..." : "📄 Generate Report"}
                  </button>
                </div>

                <p className="alert-meta">
                  👤 {alert.guest_name} &nbsp;|&nbsp; 🚪 Room {alert.room_number} &nbsp;|&nbsp; 📍 {alert.location}
                </p>
                <p className="alert-meta">
                  🕐 {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.3rem" }}>
                  "{alert.description}"
                </p>

                {reports[alert.id] && (
                  <div style={{
                    marginTop: "1rem",
                    background: "#0f172a",
                    border: "1px solid #1d4ed8",
                    borderRadius: "8px",
                    padding: "1rem"
                  }}>
                    <p style={{ color: "#93c5fd", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                      📋 Gemini Incident Report
                    </p>
                    <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.6 }}>
                      {reports[alert.id]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}