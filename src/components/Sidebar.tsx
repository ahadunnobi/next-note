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
  Star,
  Clock,
  X,
  PlusCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNoteStore } from "@/lib/store"
import { useRouter } from "next/navigation"

interface SidebarProps {
  isOpenMobile?: boolean
  setIsOpenMobile?: (open: boolean) => void
}

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export default function Sidebar({ isOpenMobile, setIsOpenMobile }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const notes = useNoteStore((state) => state.notes)
  const addNote = useNoteStore((state) => state.addNote)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleNewNote = () => {
    const id = addNote()
    router.push(`/notes/${id}`)
    if (setIsOpenMobile) setIsOpenMobile(false)
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", onClick: () => { router.push("/"); if(setIsOpenMobile) setIsOpenMobile(false); } },
    { icon: BookOpen, label: "All Notes", onClick: () => { router.push("/notes"); if(setIsOpenMobile) setIsOpenMobile(false); } },
    { icon: PlusCircle, label: "New Note", onClick: handleNewNote, primary: true },
  ]

  const sections = [
    {
      title: "Favorites",
      items: notes.filter(n => n.isFavorite).map(n => ({ id: n.id, label: n.title, icon: Star }))
    },
    {
      title: "Recent",
      items: notes.slice(0, 5).map(n => ({ id: n.id, label: n.title, icon: Clock }))
    }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpenMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpenMobile?.(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={false}
        animate={{ 
          width: isCollapsed ? 70 : 260,
          x: isOpenMobile ? 0 : (typeof window !== "undefined" && window.innerWidth < 1024 ? -260 : 0)
        }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className={cn(
          "fixed lg:relative h-screen bg-bg-dark border-r border-border-subtle flex flex-col z-[70] lg:z-50",
          isCollapsed ? "items-center" : "items-stretch",
          !isOpenMobile && "max-lg:-translate-x-full"
        )}
      >
        {/* Header */}
        <div className={cn("p-4 flex items-center justify-between", isCollapsed && "justify-center")}>
          {!isCollapsed && (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center font-bold text-white shadow-lg glow-hover">
                N
              </div>
              <span className="font-bold text-lg tracking-tight">Next Note</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center font-bold text-white cursor-pointer" onClick={() => router.push("/")}>
              N
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-white/5 rounded-md text-text-muted hover:text-white transition-colors max-lg:hidden"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button 
              onClick={() => setIsOpenMobile?.(false)}
              className="p-1 hover:bg-white/5 rounded-md text-text-muted hover:text-white transition-colors lg:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar Placeholder */}
        <div className="px-4 mb-6">
          <div 
            onClick={() => {
              const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true });
              document.dispatchEvent(event);
            }}
            className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer text-text-muted group",
            isCollapsed ? "justify-center px-0 w-8" : "w-full"
          )}>
            <Search size={16} className="group-hover:text-white transition-colors" />
            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between">
                <span className="text-sm">Search</span>
                <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/5 text-text-muted">⌘K</kbd>
              </div>
            )}
          </div>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto subtle-scroll">
          {menuItems.map((item, idx) => (
            <div 
              key={idx}
              onClick={item.onClick}
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
          {!isCollapsed && notes.length > 0 && <div className="my-6 border-t border-border-subtle" />}

          {/* Sections */}
          <AnimatePresence>
            {!isCollapsed && sections.map((section) => (
              section.items.length > 0 && (
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
                        key={item.id}
                        onClick={() => { router.push(`/notes/${item.id}`); if(setIsOpenMobile) setIsOpenMobile(false); }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-all cursor-pointer group"
                      >
                        <item.icon size={14} className={cn("opacity-50 group-hover:opacity-100", item.icon === Star && "text-amber-400 opacity-100")} />
                        <span className="text-sm truncate">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </nav>

        {/* Footer */}
        <div className={cn("p-4 border-t border-border-subtle", isCollapsed && "flex justify-center")}>
          <div className={cn(
            "flex flex-col gap-4",
            isCollapsed ? "items-center" : ""
          )}>
            {/* Theme Toggle */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer text-text-muted hover:text-white w-fit",
                  isCollapsed ? "p-2" : "px-3"
                )}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                {!isCollapsed && <span className="text-sm font-medium">Theme</span>}
              </button>
            )}

            <div className={cn(
              "flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer text-text-muted hover:text-white",
              isCollapsed ? "p-0" : ""
            )}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">Ahadunnobi</p>
                  <p className="text-xs text-text-muted truncate">Pro Plan</p>
                </div>
              )}
              {!isCollapsed && <Settings size={16} />}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

}
