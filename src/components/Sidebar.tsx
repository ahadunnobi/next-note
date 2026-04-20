"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Search, 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Hash,
  Star,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: BookOpen, label: "All Notes", href: "/notes" },
    { icon: Plus, label: "New Note", href: "/new", primary: true },
  ]

  const sections = [
    {
      title: "Favorites",
      items: [
        { label: "Next.js 15 Setup", icon: Star },
        { label: "React Server Components", icon: Star },
      ]
    },
    {
      title: "Recent",
      items: [
        { label: "Tailwind 4.0 Docs", icon: Clock },
        { label: "Linear Design Tokens", icon: Clock },
      ]
    }
  ]

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 70 : 260 }}
      className={cn(
        "relative h-screen bg-bg-dark border-r border-border-subtle flex flex-col transition-all duration-300 ease-in-out z-50",
        isCollapsed ? "items-center" : "items-stretch"
      )}
    >
      {/* Header */}
      <div className={cn("p-4 flex items-center justify-between", isCollapsed && "justify-center")}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center font-bold text-white shadow-lg glow-hover">
              N
            </div>
            <span className="font-bold text-lg tracking-tight">Next Note</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center font-bold text-white">
            N
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-white/5 rounded-md text-text-muted hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Search Bar Placeholder */}
      <div className="px-4 mb-6">
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer text-text-muted group",
          isCollapsed ? "justify-center px-0 w-10" : "w-full"
        )}>
          <Search size={16} className="group-hover:text-white transition-colors" />
          {!isCollapsed && (
            <div className="flex flex-1 items-center justify-between">
              <span className="text-sm">Search</span>
              <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/5">⌘K</kbd>
            </div>
          )}
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <div 
            key={item.label}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer group",
              item.primary ? "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20" : "hover:bg-white/5 text-text-muted hover:text-white",
              isCollapsed && "justify-center px-0 w-10 h-10"
            )}
          >
            <item.icon size={18} />
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
          </div>
        ))}

        {/* Separator */}
        <div className="my-6 border-t border-border-subtle" />

        {/* Sections */}
        <AnimatePresence>
          {!isCollapsed && sections.map((section) => (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={section.title} 
              className="mb-6"
            >
              <h3 className="px-3 text-[10px] uppercase tracking-widest text-text-muted/50 font-bold mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <div 
                    key={item.label}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-all cursor-pointer group"
                  >
                    <item.icon size={14} className="opacity-50 group-hover:opacity-100" />
                    <span className="text-sm truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>

      {/* Footer */}
      <div className={cn("p-4 border-t border-border-subtle", isCollapsed && "flex justify-center")}>
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer",
          isCollapsed ? "p-0" : ""
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Ahadunnobi</p>
              <p className="text-xs text-text-muted truncate">Pro Plan</p>
            </div>
          )}
          {!isCollapsed && <Settings size={16} className="text-text-muted" />}
        </div>
      </div>
    </motion.div>
  )
}
