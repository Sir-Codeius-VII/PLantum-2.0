"use client"

import { useState } from "react"

export default function TextareaComponent() {
  const [text, setText] = useState("")
  return <textarea value={text} onChange={(e) => setText(e.target.value)} />
}

