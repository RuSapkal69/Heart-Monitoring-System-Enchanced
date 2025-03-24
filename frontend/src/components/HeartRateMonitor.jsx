"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { Heart, Activity, Droplet, Wifi, WifiOff, Fingerprint, AlertCircle, LogOut } from "lucide-react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const HeartRateMonitor = () => {
  const [connected, setConnected] = useState(false)
  const [ipAddress, setIpAddress] = useState("")
  const [heartRate, setHeartRate] = useState(null)
  const [avgHeartRate, setAvgHeartRate] = useState(null)
  const [spo2, setSpo2] = useState(null)
  const [fingerDetected, setFingerDetected] = useState(false)
  const [irValue, setIrValue] = useState(0)
  const [error, setError] = useState("")
  const [readings, setReadings] = useState([])

  const { currentUser, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const websocketRef = useRef(null)
  const readingsLimit = 60 // Store 30 seconds of data (assuming 0.5s updates)

  // Connect to the WebSocket server
  const connectToSensor = () => {
    if (!ipAddress) {
      setError("192.168.254.156")
      return
    }

    try {
      // Close existing connection if any
      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.close()
      }

      // Create new WebSocket connection
      const ws = new WebSocket(`ws://${ipAddress}:81`)

      ws.onopen = () => {
        console.log("Connected to ESP32")
        setConnected(true)
        setError("")
      }

      ws.onclose = () => {
        console.log("Disconnected from ESP32")
        setConnected(false)
      }

      ws.onerror = (err) => {
        console.error("WebSocket error:", err)
        setError("Failed to connect. Check the IP address and ensure the ESP32 is online.")
        setConnected(false)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          // Update state with received data
          setHeartRate(data.heartRate)
          setAvgHeartRate(data.beatAvg)
          setSpo2(data.spo2)
          setFingerDetected(data.fingerDetected)
          setIrValue(data.irValue)

          // Add to readings history with timestamp
          const timestamp = new Date()
          setReadings((prev) => {
            // Keep only the most recent readings up to the limit
            const newReadings = [
              ...prev,
              {
                timestamp,
                heartRate: data.heartRate,
                spo2: data.spo2,
                avgHeartRate: data.beatAvg,
              },
            ]

            if (newReadings.length > readingsLimit) {
              return newReadings.slice(newReadings.length - readingsLimit)
            }
            return newReadings
          })

          // Save reading to database
          saveReading({
            userId: currentUser._id,
            heartRate: data.heartRate,
            spo2: data.spo2,
            avgHeartRate: data.beatAvg,
            timestamp: timestamp,
          })
        } catch (err) {
          console.error("Error parsing WebSocket data:", err)
        }
      }

      websocketRef.current = ws
    } catch (err) {
      console.error("Error connecting to WebSocket:", err)
      setError("Failed to connect: " + err.message)
    }
  }

  // Save reading to database
  const saveReading = async (readingData) => {
    try {
      const token = localStorage.getItem("token")

      await fetch("http://localhost:5000/api/readings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(readingData),
      })
    } catch (error) {
      console.error("Error saving reading:", error)
    }
  }

  // Clean up WebSocket connection on component unmount
  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
      }
    }
  }, [])

  const handleLogout = () => {
    if (websocketRef.current) {
      websocketRef.current.close()
    }
    logout()
    navigate("/signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with user info */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 inline-block mb-2">
              Heart Rate & SpO2 Monitor
            </h1>
            <p className="text-slate-400">Welcome, {currentUser?.name || "User"}</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Connection Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="ESP32 IP Address (e.g. 192.168.1.100)"
                className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={connectToSensor}
                disabled={connected}
                className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  connected
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5"
                }`}
              >
                <Wifi className="w-5 h-5" />
                Connect
              </button>
              <button
                onClick={() => {
                  if (websocketRef.current) websocketRef.current.close()
                  setConnected(false)
                }}
                disabled={!connected}
                className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  !connected
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg hover:shadow-rose-500/20 hover:-translate-y-0.5"
                }`}
              >
                <WifiOff className="w-5 h-5" />
                Disconnect
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3 text-rose-200">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            className={`flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm border transition-all ${
              connected
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}></div>
            <div className="font-medium">{connected ? "Connected to ESP32" : "Disconnected"}</div>
          </div>

          <div
            className={`flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm border transition-all ${
              fingerDetected
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}
          >
            <Fingerprint className={`w-5 h-5 ${fingerDetected ? "text-emerald-400" : "text-amber-400"}`} />
            <div className="font-medium">{fingerDetected ? "Finger Detected" : "No Finger Detected"}</div>
          </div>
        </div>

        {/* Readings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Heart Rate Card */}
          <div
            className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 transition-all hover:shadow-lg hover:shadow-pink-500/10 group ${
              heartRate ? "animate-heartbeat" : ""
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {heartRate ? `${heartRate}` : "--"}
                <span className="text-lg font-normal text-slate-400 ml-1">BPM</span>
              </div>
              <div className="text-slate-400">Heart Rate</div>
            </div>
          </div>

          {/* Average Heart Rate Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 transition-all hover:shadow-lg hover:shadow-purple-500/10 group">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {avgHeartRate ? `${avgHeartRate}` : "--"}
                <span className="text-lg font-normal text-slate-400 ml-1">BPM</span>
              </div>
              <div className="text-slate-400">Average HR</div>
            </div>
          </div>

          {/* SpO2 Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Droplet className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {spo2 ? `${spo2}` : "--"}
                <span className="text-lg font-normal text-slate-400 ml-1">%</span>
              </div>
              <div className="text-slate-400">SpO2</div>
            </div>
          </div>
        </div>

        {/* Readings History */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 transition-all">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Recent Readings
          </h3>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {readings.length > 0 ? (
              <div className="relative overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-700/50 text-slate-300 text-sm uppercase">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Time</th>
                      <th className="px-4 py-3">Heart Rate</th>
                      <th className="px-4 py-3">Avg HR</th>
                      <th className="px-4 py-3 rounded-tr-lg">SpO2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readings.slice(-10).map((reading, index) => (
                      <tr
                        key={index}
                        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                          index === readings.slice(-10).length - 1 ? "animate-pulse-row" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-slate-300">{reading.timestamp.toLocaleTimeString()}</td>
                        <td className="px-4 py-3">
                          <span className="text-pink-400 font-medium">{reading.heartRate || "--"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-purple-400 font-medium">{reading.avgHeartRate || "--"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-blue-400 font-medium">{reading.spo2 || "--"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Activity className="w-12 h-12 text-slate-600 mb-3" />
                <p>No readings available yet</p>
                <p className="text-sm text-slate-500 mt-1">Connect to your ESP32 to start monitoring</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeartRateMonitor

