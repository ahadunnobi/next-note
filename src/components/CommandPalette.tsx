"use client"

import React, { useEffect, useState } from "react"
import { 
  Command, 
  Search, 
  FileText, 
  Plus, 
  Settings, 
  Hash,
  Zap
} from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" 
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <div className="fixed inset-0 flex items-start justify-center pt-[15vh] pointer-events-none p-4 z-[101]">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="w-full max-w-xl glass rounded-2xl overflow-hidden shadow-2xl pointer-events-auto border border-white/10 linear-border"
                >
                  <div className="flex items-center px-4 py-4 border-b border-white/5 gap-3">
                    <Search className="text-text-muted" size={20} />
                    <input 
                      autoFocus
                      placeholder="Type a command or search..."
                      className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-text-muted"
                    />
                    <kbd className="text-[10px] bg-white/10 px-2 py-1 rounded border border-white/5 text-text-muted">ESC</kbd>
                  </div>

                  <div className="p-2 max-h-[60vh] overflow-y-auto subtle-scroll">
                    <Section title="Quick Actions">
                      <Item icon={Plus} label="New Note" shortcut="N" />
                      <Item icon={Zap} label="Quick Task" shortcut="T" />
                    </Section>

                    <Section title="Recent Notes">
                      <Item icon={FileText} label="Next.js 15 Middleware API" />
                      <Item icon={FileText} label="React Context vs Zustand" />
                    </Section>

                    <Section title="Settings">
                      <Item icon={Settings} label="Preferences" shortcut="," />
                    </Section>
                  </div>

                  <div className="px-4 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[11px] text-text-muted">
                    <div className="flex gap-4">
                      <span><kbd className="bg-white/5 px-1 rounded mr-1">↑↓</kbd> to navigate</span>
                      <span><kbd className="bg-white/5 px-1 rounded mr-1">↵</kbd> to select</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Search by</span>
                      <span className="font-bold text-white tracking-widest">NEXT NOTE</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <h3 className="px-3 py-2 text-[10px] font-bold text-text-muted/50 uppercase tracking-widest">{title}</h3>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  )
}

function Item({ icon: Icon, label, shortcut }: { icon: any, label: string, shortcut?: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-text-muted group-hover:text-brand-primary" />
        <span className="text-sm font-medium group-hover:text-white">{label}</span>
      </div>
      {shortcut && (
        <kbd className="text-[10px] text-text-muted opacity-40 group-hover:opacity-100">{shortcut}</kbd>
      )}
    </div>
  )
}
