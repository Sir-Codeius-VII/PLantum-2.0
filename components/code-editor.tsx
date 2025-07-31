"use client"

import { useEffect, useState } from "react"
import { configureMonaco } from "@/lib/monaco-config"

// Dynamic import to avoid SSR issues
import dynamic from "next/dynamic"
const MonacoEditor = dynamic(() => import("react-monaco-editor"), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-muted flex items-center justify-center">Loading editor...</div>,
})

interface CodeEditorProps {
  value?: string
  language?: string
  onChange?: (value: string) => void
  height?: string | number
  readOnly?: boolean
}

export function CodeEditor({
  value = "",
  language = "javascript",
  onChange,
  height = 400,
  readOnly = false,
}: CodeEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    configureMonaco()
  }, [])

  if (!mounted) {
    return <div className="h-64 w-full bg-muted flex items-center justify-center">Loading editor...</div>
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <MonacoEditor
        width="100%"
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          readOnly,
          automaticLayout: true,
        }}
      />
    </div>
  )
}

