import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import HeartRateMonitor from "./components/HeartRateMonitor"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/data" element={<HeartRateMonitor />} />
      </Routes>
    </Router>
  )
}

export default App

