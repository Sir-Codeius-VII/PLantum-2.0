'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { Button } from './button'
import { Progress } from './progress'
import { toast } from 'sonner'

interface FileUploadProps {
  onUploadComplete: (url: string) => void
  onUploadError: (error: string) => void
  accept?: string[]
  maxSize?: number
  className?: string
  id?: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

export function FileUpload({
  onUploadComplete,
  onUploadError,
  accept = ['image/*', 'video/*'],
  maxSize = MAX_FILE_SIZE,
  className,
  id,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${maxSize / 1024 / 1024}MB limit`
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

    if (!isImage && !isVideo) {
      return 'Invalid file type. Supported formats: JPEG, PNG, GIF, WebP, MP4, WebM, MOV'
    }

    return null
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      onUploadError(validationError)
      return
    }

    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
    }

    try {
      setIsUploading(true)
      setProgress(0)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('filename', file.name)
      formData.append('type', file.type.startsWith('image/') ? 'image' : 'video')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }

      const data = await response.json()
      setProgress(100)
      onUploadComplete(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      onUploadError(error instanceof Error ? error.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }, [onUploadComplete, onUploadError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
  })

  const clearPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
      >
        <input {...getInputProps()} id={id} />
        {preview ? (
          <div className="relative">
            {preview.startsWith('blob:') && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearPreview}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? 'Drop the file here'
                : 'Drag & drop a file here, or click to select'}
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPEG, PNG, GIF, WebP, MP4, WebM, MOV
            </p>
          </div>
        )}
      </div>
      {isUploading && (
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  )
} 