"use client"

import { useNoteStore, Note } from "@/lib/store"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { createLowlight, common } from "lowlight"

const lowlightInstance = createLowlight(common)
import { 
  MoreHorizontal, 
  Share2, 
  Star, 
  Type,
  ImageIcon,
  Link2,
  History,
  Trash2,
  Zap,
  CheckSquare,
  Code,
  ChevronLeft
} from "lucide-react"
import Link from "next/link"

interface EditorProps {
  note: Note
}

import { toast } from "sonner"

export default function Editor({ note }: EditorProps) {
  const updateNote = useNoteStore((state) => state.updateNote)
  const toggleFavorite = useNoteStore((state) => state.toggleFavorite)
  const deleteNote = useNoteStore((state) => state.deleteNote)

  const handleToggleFavorite = () => {
    toggleFavorite(note.id)
    if (!note.isFavorite) {
      toast.success("Added to favorites")
    } else {
      toast.info("Removed from favorites")
    }
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(note.id)
      toast.error("Note deleted successfully")
      window.location.href = "/"
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Press '/' for commands...",
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight: lowlightInstance,
      }),
    ],
    content: note.content,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      // Auto-save content
      updateNote(note.id, { content: editor.getHTML() })
    },
  })

  const [title, setTitle] = React.useState(note.title)
  const [isSaving, setIsSaving] = React.useState(false)

  // Sync title with store
  const handleTitleChange = (e: React.ChangeEvent<HTMLHeadingElement>) => {
    const newTitle = e.currentTarget.textContent || "Untitled"
    setTitle(newTitle)
    setIsSaving(true)
    updateNote(note.id, { title: newTitle })
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Changes saved", { duration: 1500, position: "bottom-center" })
    }, 800)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      {/* Editor Header/Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2 sm:gap-4 text-text-muted text-xs sm:text-sm overflow-hidden">
          <Link href="/" className="hover:text-white cursor-pointer transition-colors flex items-center gap-1 flex-shrink-0">
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <span className="hidden sm:inline">/</span>
          <span className="text-white font-medium truncate max-w-[120px] sm:max-w-[200px]">{title}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {isSaving && (
            <span className="text-[10px] text-brand-primary animate-pulse mr-1 sm:mr-2">Saving...</span>
          )}
          <button 
            onClick={handleToggleFavorite}
            className={cn(
              "p-2 rounded-lg transition-colors",
              note.isFavorite ? "text-amber-400 bg-amber-400/10" : "text-text-muted hover:bg-white/5 hover:text-white"
            )}
            title="Favorite"
          >
            <Star size={18} fill={note.isFavorite ? "currentColor" : "none"} />
          </button>
          <button className="px-2 sm:px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm text-white transition-colors border border-white/5 flex items-center gap-2">
            <Share2 size={16} />
            <span className="hidden xs:inline">Share</span>
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="space-y-4 sm:space-y-6">
        <h1 
          className="text-3xl sm:text-5xl font-bold tracking-tight outline-none focus:placeholder:opacity-10 caret-brand-primary break-words" 
          contentEditable 
          suppressContentWarning
          onBlur={handleTitleChange}
        >
          {note.title}
        </h1>

        <div className="flex items-center gap-2 py-1 px-3 sm:px-4 w-fit rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-text-muted">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          {note.folder}
        </div>

        <div className="min-h-[400px] sm:min-h-[500px] text-base sm:text-lg leading-relaxed">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Floating Toolbar (Linear style) */}
      <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 glass px-2 sm:px-4 py-2 rounded-xl sm:rounded-2xl flex items-center gap-1 sm:gap-2 shadow-2xl border border-white/10 z-[100] max-w-[95vw] overflow-x-auto no-scrollbar">
        <ToolbarButton icon={Type} label="Text" onClick={() => editor?.chain().focus().setParagraph().run()} />
        <ToolbarButton icon={CheckSquare} label="Task" onClick={() => editor?.chain().focus().toggleTaskList().run()} />
        <ToolbarButton icon={Code} label="Code" onClick={() => editor?.chain().focus().toggleCodeBlock().run()} />
        <div className="w-px h-4 bg-white/10 mx-1 flex-shrink-0" />
        <ToolbarButton icon={History} label="History" />
        <ToolbarButton 
          icon={Trash2} 
          label="Delete" 
          danger 
          onClick={handleDelete} 
        />
      </div>
    </div>
  )
}


function ToolbarButton({ icon: Icon, label, onClick, danger }: { icon: any, label: string, onClick?: () => void, danger?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg transition-all text-sm font-medium flex-shrink-0 ${danger ? 'text-red-400 hover:bg-red-400/10' : 'text-text-muted hover:bg-white/5 hover:text-white'}`}
      title={label}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}

function CommandItem({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group">
      <Icon size={16} className="text-text-muted group-hover:text-brand-primary" />
      <span className="text-sm font-medium group-hover:text-white">{label}</span>
    </div>
  )
}
