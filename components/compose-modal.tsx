"use client"

import type React from "react"

import { useState } from "react"
import { X, Image, Link2, Smile, MapPin, Calendar, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ComposeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (content: string, tags: string[]) => void
}

export function ComposeModal({ open, onOpenChange, onSubmit }: ComposeModalProps) {
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [error, setError] = useState("")

  // Ensure proper form validation
  const validateForm = () => {
    if (!content.trim()) {
      setError("Content cannot be empty")
      return false
    }
    return true
  }

  // Make sure the modal properly closes after submission
  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit?.(content, tags)
    setContent("")
    setTags([])
    setError("")
    onOpenChange(false)
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(`#${currentTag.trim()}`)) {
      setTags([...tags, `#${currentTag.trim()}`])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit()
    } else if (e.key === "Enter" && currentTag) {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="flex gap-3 mt-2">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[120px] border-none focus-visible:ring-0 text-base p-0 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-invalid={!!error}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                    <button className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center mt-2 border rounded-md">
              <input
                type="text"
                placeholder="Add a tag (e.g. startup)"
                className="flex-1 px-3 py-1 text-sm bg-transparent border-none focus:outline-none"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value.replace(/^#/, ""))}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" variant="ghost" size="sm" onClick={addTag} disabled={!currentTag.trim()}>
                Add
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-b py-2 mt-4">
          <div className="text-sm font-medium">Add to your post</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-emerald-500">
              <Image className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-blue-500">
              <Link2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-amber-500">
              <Smile className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-red-500">
              <MapPin className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-purple-500">
              <Calendar className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!content.trim()} className="gap-2">
            Post
            <Send className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

