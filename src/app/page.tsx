"use client"

import React from "react"
import { motion } from "framer-motion"
import { 
  ArrowUpRight, 
  Code2, 
  Layout, 
  Zap, 
  FileText,
  CheckCircle2,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Notes Created", value: "24", icon: FileText, color: "text-blue-400" },
  { label: "Tasks Done", value: "12", icon: CheckCircle2, color: "text-emerald-400" },
  { label: "Active Stacks", value: "3", icon: Code2, color: "text-amber-400" },
]

const recentNotes = [
  { title: "Next.js 15 Middleware API", folder: "Next.js", date: "2 mins ago" },
  { title: "React Context vs Zustand", folder: "React", date: "1 hour ago" },
  { title: "Tailwind 4.0 Theme Configuration", folder: "Tailwind CSS", date: "3 hours ago" },
]

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Good Evening, Ahad</h1>
          <p className="text-text-muted text-lg">Here's what's happening with your tech stacks today.</p>
        </div>
        <button className="px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-primary/90 text-white font-medium transition-all shadow-lg glow-hover flex items-center gap-2">
          <Zap size={18} />
          New Quick Note
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="linear-border p-6 rounded-2xl bg-white/5 space-y-4 hover:bg-white/[0.07] transition-colors"
          >
            <div className={cn("p-2 rounded-lg bg-white/5 w-fit", stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Notes */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={20} className="text-text-muted" />
              Recent Notes
            </h2>
            <button className="text-sm font-medium text-brand-primary flex items-center gap-1 hover:underline">
              View all
              <ArrowUpRight size={14} />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentNotes.map((note) => (
              <div 
                key={note.title}
                className="group flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-muted group-hover:text-brand-primary transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium group-hover:text-white mb-0.5">{note.title}</h4>
                    <p className="text-xs text-text-muted flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5">{note.folder}</span>
                      {note.date}
                    </p>
                  </div>
                </div>
                <ArrowUpRight size={18} className="text-text-muted opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Focus */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Layout size={20} className="text-text-muted" />
              Stack Focus
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {["Next.js", "React", "Typescript", "Tailwind"].map((tech) => (
              <div 
                key={tech}
                className="linear-border aspect-square rounded-2xl bg-white/5 flex flex-col items-center justify-center gap-3 hover:bg-white/[0.07] transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-primary/50 transition-colors">
                  <Code2 size={24} className="text-text-muted group-hover:text-brand-primary transition-colors" />
                </div>
                <span className="font-semibold">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
