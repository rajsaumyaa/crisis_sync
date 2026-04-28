import { useState } from "react"
import GuestSOS from "./pages/GuestSOS"
import StaffDashboard from "./pages/StaffDashboard"
import "./index.css"

export default function App() {
  const [page, setPage] = useState("guest")

  return (
    <div>
      <nav className="nav">
        <h1>🚨 CrisisSync</h1>
        <div className="nav-links">
          <button
            className={page === "guest" ? "active" : ""}
            onClick={() => setPage("guest")}
          >
            Guest SOS
          </button>
          <button
            className={page === "staff" ? "active" : ""}
            onClick={() => setPage("staff")}
          >
            Staff Dashboard
          </button>
        </div>
      </nav>
      {page === "guest" ? <GuestSOS /> : <StaffDashboard />}
    </div>
  )
}