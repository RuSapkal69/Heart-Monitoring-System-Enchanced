import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import FeatureCard from "../components/FeatureCard"
import { ArrowRight, Heart, Activity, Droplet } from "lucide-react"

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  // Track mouse position for background effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Calculate background gradient based on mouse position
  const gradientStyle = {
    background: `radial-gradient(
      circle at ${mousePosition.x}px ${mousePosition.y}px,
      rgba(255, 100, 100, 0.15),
      rgba(100, 100, 255, 0.1) 40%,
      rgba(200, 100, 200, 0.05) 60%,
      rgba(28, 28, 45, 0) 80%
    )`,
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Interactive background */}
      <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500" style={gradientStyle} />

      <NavBar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-48 md:pb-28">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              className="md:w-1/2 mb-12 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                Heart Pulse Monitoring Necklace
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300">
                Monitor your heart rate and blood oxygen levels in real-time with our stylish wearable device.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/monitor"
                  className="group flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  View Your Health Data
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="flex items-center justify-center gap-2 bg-transparent border-2 border-purple-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-purple-500/10 transition-all duration-300">
                  Contact Us
                </button>
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="https://www.researchgate.net/publication/341909859/figure/fig3/AS:898708992442369@1591280329308/Smart-Heart-cardiac-monitor-necklace-by-Leah-Heiss-2016-in-collaboration-with-St.png"
                    alt="Heart Pulse Monitoring Necklace"
                    className="object-cover w-full h-full opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-6 right-6 p-4 bg-gray-600/30 backdrop-blur-md rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500 animate-pulse" />
                        <span className="text-xl font-bold">75 BPM</span>
                      </div>
                      <div className="w-px h-8 bg-white/20"></div>
                      <div className="flex items-center gap-2">
                        <Droplet className="w-5 h-5 text-blue-500" />
                        <span className="text-xl font-bold">98% SpO₂</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-pink-500/10 rounded-full filter blur-3xl"></div>
      </section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="py-20 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Advanced Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our wearable necklace combines cutting-edge technology with elegant design to provide accurate health
              monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Heart className="w-10 h-10 text-pink-500" />}
              title="Real-time Heart Rate"
              description="Continuous monitoring of your heart rate with medical-grade accuracy using advanced sensors."
              delay={0.1}
            />
            <FeatureCard
              icon={<Droplet className="w-10 h-10 text-blue-500" />}
              title="Blood Oxygen Levels"
              description="Track your SpO₂ levels throughout the day to ensure optimal oxygen saturation."
              delay={0.2}
            />
            <FeatureCard
              icon={<Activity className="w-10 h-10 text-green-500" />}
              title="Health Insights"
              description="Get personalized insights and recommendations based on your vital signs."
              delay={0.3}
            />
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        className="py-20 bg-slate-800/50 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our ESP32-powered necklace with MAX30102 sensor seamlessly connects to our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transform -translate-y-1/2 z-0"></div>

            {/* Steps */}
            <div className="relative z-10">
              <motion.div
                className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl font-bold text-pink-500">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">Wearable Device</h3>
                <p className="text-gray-300 text-center">
                  The necklace contains an ESP32 microcontroller and MAX30102 sensor to measure heart rate and SpO₂.
                </p>
              </motion.div>
            </div>

            <div className="relative z-10">
              <motion.div
                className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl font-bold text-purple-500">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">Data Transmission</h3>
                <p className="text-gray-300 text-center">
                  The ESP32 securely transmits your health data to our web platform in real-time via WiFi.
                </p>
              </motion.div>
            </div>

            <div className="relative z-10">
              <motion.div
                className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl font-bold text-blue-500">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">Web Dashboard</h3>
                <p className="text-gray-300 text-center">
                  View your health metrics on our intuitive dashboard with historical data and trends.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Video/Demo Section */}
      <motion.section
        className="py-20 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">See It In Action</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Watch how our Heart Pulse Monitoring Necklace works in real-time.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-white/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=720&width=1280"
                  alt="Product Demo"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors duration-300 group">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1 group-hover:scale-110 transition-transform"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-10 border border-white/10 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to monitor your heart health?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Get real-time insights into your heart rate and blood oxygen levels with our stylish and comfortable
                wearable necklace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/monitor"
                  className="group flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  View Your Health Data
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="flex items-center justify-center gap-2 bg-transparent border-2 border-purple-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-purple-500/10 transition-all duration-300">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  )
}

