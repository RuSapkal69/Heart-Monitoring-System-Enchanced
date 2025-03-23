"use client"

import { motion } from "framer-motion"

export default function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <motion.div
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full"
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="mb-6 w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center">{icon}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  )
}

