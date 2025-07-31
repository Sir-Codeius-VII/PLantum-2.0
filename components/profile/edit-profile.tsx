'use client'

import { useState } from 'react'
import { useAuthContext } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileUpload } from '@/components/ui/file-upload'
import { toast } from 'sonner'

export function EditProfile() {
  const { user, updateProfile } = useAuthContext()
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }

    try {
      setIsLoading(true)
      await updateProfile({
        name: name.trim(),
        bio: bio.trim(),
      })
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (imageUrl: string) => {
    try {
      setIsLoading(true)
      await updateProfile({ avatar_url: imageUrl })
    } catch (error) {
      console.error('Avatar update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="avatar">Profile Picture</Label>
          <FileUpload
            id="avatar"
            onUploadComplete={handleImageUpload}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
} 