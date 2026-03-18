"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  Users,
  Zap,
  Calendar,
  TrendingUp,
  Heart,
  MessageSquare,
  Share2,
  MapPin,
  Clock,
  Ticket,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import GradientText from "@/components/ui/gradient-text"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { toast } from "sonner"

// Mock data for platform metrics
const platformMetrics = [
  {
    id: 1,
    title: "Total Funding",
    value: "R 789M",
    change: "+30%",
    trend: "up",
    icon: <ArrowUpRight className="h-5 w-5 text-primary" />,
    description: "Total capital raised through the platform",
  },
  {
    id: 2,
    title: "Startups",
    value: "1,234",
    change: "+20%",
    trend: "up",
    icon: <Zap className="h-5 w-5 text-indigo-500" />,
    description: "Active startups on the platform",
  },
  {
    id: 3,
    title: "Investors",
    value: "567",
    change: "+15%",
    trend: "up",
    icon: <Users className="h-5 w-5 text-emerald-500" />,
    description: "Active investors seeking opportunities",
  },
  {
    id: 4,
    title: "Live Funding Rounds",
    value: "78",
    change: "+25%",
    trend: "up",
    icon: <Calendar className="h-5 w-5 text-amber-500" />,
    description: "Funding rounds currently active",
  },
]

// Function to generate mock comments based on post
const generateMockComments = (postId: number, postType: string, postContent: string) => {
  const commentSets: Record<number, Array<{
    id: number
    author: { name: string; avatar: string }
    content: string
    timestamp: string
  }>> = {
    1: [
      {
        id: 1,
        author: { name: "Sarah M.", avatar: "/placeholder-user.jpg" },
        content: "Congratulations on the seed round! R5M is impressive. What's your plan for scaling?",
        timestamp: "1 hour ago"
      },
      {
        id: 2,
        author: { name: "Mike T.", avatar: "/placeholder-user.jpg" },
        content: "Savannah Ventures is a great lead investor. Excited to see where this takes you! 🚀",
        timestamp: "2 hours ago"
      },
      {
        id: 3,
        author: { name: "David K.", avatar: "/placeholder-user.jpg" },
        content: "Are you hiring? I'd love to learn more about the team expansion.",
        timestamp: "3 hours ago"
      }
    ],
    2: [
      {
        id: 1,
        author: { name: "Lisa P.", avatar: "/placeholder-user.jpg" },
        content: "This sounds amazing! I've already registered. Can't wait to network with everyone.",
        timestamp: "2 hours ago"
      },
      {
        id: 2,
        author: { name: "James W.", avatar: "/placeholder-user.jpg" },
        content: "Will there be any virtual attendance options? I'm based in Durban.",
        timestamp: "4 hours ago"
      },
      {
        id: 3,
        author: { name: "Emma R.", avatar: "/placeholder-user.jpg" },
        content: "The lineup looks incredible! What time do the keynote speakers start?",
        timestamp: "5 hours ago"
      }
    ],
    3: [
      {
        id: 1,
        author: { name: "Alex B.", avatar: "/placeholder-user.jpg" },
        content: "10,000 users is a huge milestone! 🎉 What's been the key to your growth?",
        timestamp: "1 hour ago"
      },
      {
        id: 2,
        author: { name: "Nina S.", avatar: "/placeholder-user.jpg" },
        content: "Amazing achievement! The healthcare sector needs more innovative solutions like yours.",
        timestamp: "3 hours ago"
      },
      {
        id: 3,
        author: { name: "Tom H.", avatar: "/placeholder-user.jpg" },
        content: "Congratulations! How long did it take to reach this milestone?",
        timestamp: "4 hours ago"
      }
    ],
    4: [
      {
        id: 1,
        author: { name: "Rachel M.", avatar: "/placeholder-user.jpg" },
        content: "This is a great opportunity! What criteria are you looking for in the startups?",
        timestamp: "3 hours ago"
      },
      {
        id: 2,
        author: { name: "Chris L.", avatar: "/placeholder-user.jpg" },
        content: "I've applied! When will selected companies be notified?",
        timestamp: "5 hours ago"
      },
      {
        id: 3,
        author: { name: "Sophie K.", avatar: "/placeholder-user.jpg" },
        content: "Free tickets are a nice touch. Will there be recording available for those who can't attend?",
        timestamp: "6 hours ago"
      },
      {
        id: 4,
        author: { name: "Mark D.", avatar: "/placeholder-user.jpg" },
        content: "What's the typical investment size you're looking at for this pitch day?",
        timestamp: "1 day ago"
      }
    ],
    5: [
      {
        id: 1,
        author: { name: "Priya N.", avatar: "/placeholder-user.jpg" },
        content: "This is exactly what the fintech space needs! Are you open to B2B payment solutions?",
        timestamp: "2 hours ago"
      },
      {
        id: 2,
        author: { name: "Ben F.", avatar: "/placeholder-user.jpg" },
        content: "Great focus areas. What's your typical check size for early-stage investments?",
        timestamp: "4 hours ago"
      },
      {
        id: 3,
        author: { name: "Zara A.", avatar: "/placeholder-user.jpg" },
        content: "Interested in learning more. Do you have a specific application process?",
        timestamp: "5 hours ago"
      },
      {
        id: 4,
        author: { name: "Ryan T.", avatar: "/placeholder-user.jpg" },
        content: "Insurtech is booming in SA. What's your take on the regulatory landscape?",
        timestamp: "1 day ago"
      },
      {
        id: 5,
        author: { name: "Maya P.", avatar: "/placeholder-user.jpg" },
        content: "Would love to connect! We're building something in the lending space.",
        timestamp: "1 day ago"
      }
    ]
  }
  
  return commentSets[postId] || [
    {
      id: 1,
      author: { name: "User", avatar: "/placeholder-user.jpg" },
      content: "Interesting update! Thanks for sharing.",
      timestamp: "1 hour ago"
    }
  ]
}

// Mock data for social feed
const feedItems = [
  {
    id: 1,
    type: "funding",
    author: {
      name: "TechNova Solutions",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Startup"
    },
    content: "Excited to announce our R5M seed funding round! 🚀 We're now looking to expand our team and accelerate product development.",
    timestamp: "2 hours ago",
    stats: {
    likes: 124,
      comments: 32,
      shares: 18
    },
    funding: {
      amount: "R5M",
      round: "Seed",
      lead: "Savannah Ventures"
    }
  },
  {
    id: 2,
    type: "event",
    author: {
      name: "Startup Africa",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Organizer"
    },
    content: "Join us for the biggest startup networking event of the year! Connect with investors, founders, and industry leaders.",
    timestamp: "5 hours ago",
    stats: {
      likes: 89,
    comments: 15,
      shares: 7
    },
    event: {
      title: "Startup Africa Summit 2024",
      date: "March 15, 2024",
      time: "09:00 - 18:00",
      location: "Cape Town International Convention Centre",
      type: "Conference",
      tickets: {
        available: 150,
        price: "R1,500"
      }
    }
  },
  {
    id: 3,
    type: "milestone",
    author: {
      name: "HealthTech Africa",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Startup"
    },
    content: "We've just reached 10,000 active users on our platform! 🎉 Thank you to our amazing community for the support.",
    timestamp: "5 hours ago",
    stats: {
      likes: 89,
    comments: 15,
      shares: 7
    }
  },
  {
    id: 4,
    type: "event",
    author: {
      name: "Innovation Capital",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Investor"
    },
    content: "We're hosting our quarterly pitch day for early-stage startups. Selected companies will get the chance to pitch to our investment committee.",
    timestamp: "1 day ago",
    stats: {
      likes: 156,
      comments: 43,
      shares: 29
    },
    event: {
      title: "Innovation Capital Pitch Day",
      date: "March 20, 2024",
      time: "14:00 - 17:00",
      location: "Innovation Hub, Johannesburg",
      type: "Pitch Event",
      tickets: {
        available: 20,
        price: "Free"
      }
    }
  },
  {
    id: 5,
    type: "investor",
    author: {
      name: "Innovation Capital",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Investor"
    },
    content: "We're actively looking to invest in early-stage fintech startups in South Africa. Focus areas: payments, lending, and insurtech.",
    timestamp: "1 day ago",
    stats: {
      likes: 156,
      comments: 43,
      shares: 29
    }
  }
]

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const documentInputRef = useRef<HTMLInputElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([])
  const [selectedMedia, setSelectedMedia] = useState<File[]>([])
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([])
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({})
  const [shareCounts, setShareCounts] = useState<Record<number, number>>({})
  const [openCommentPostId, setOpenCommentPostId] = useState<number | null>(null)
  const [comments, setComments] = useState<Record<number, Array<{
    id: number
    author: { name: string; avatar: string }
    content: string
    timestamp: string
  }>>>({})
  const [newComment, setNewComment] = useState<Record<number, string>>({})

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newDocuments = Array.from(files)
      setSelectedDocuments((prev) => [...prev, ...newDocuments])
    }
    // Reset input so the same file can be selected again
    if (e.target) {
      e.target.value = ""
    }
  }

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newMedia = Array.from(files)
      const newPreviewUrls = newMedia.map((file) => URL.createObjectURL(file))
      setSelectedMedia((prev) => [...prev, ...newMedia])
      setMediaPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
    // Reset input so the same file can be selected again
    if (e.target) {
      e.target.value = ""
    }
  }

  const handleAddDocumentClick = () => {
    documentInputRef.current?.click()
  }

  const handleAddMediaClick = () => {
    mediaInputRef.current?.click()
  }

  const handleRemoveMedia = (index: number) => {
    // Revoke object URL before removing
    if (mediaPreviewUrls[index]) {
      URL.revokeObjectURL(mediaPreviewUrls[index])
    }
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index))
    setMediaPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveDocument = (index: number) => {
    setSelectedDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileTypeIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type.startsWith("video/")) return Video
    if (file.type.startsWith("audio/")) return Music
    return FileText
  }

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      mediaPreviewUrls.forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [mediaPreviewUrls])

  const [currentUpdate, setCurrentUpdate] = useState(0)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const updates = [
    {
      title: "New Dashboard Features",
      description: "Enhanced analytics and reporting tools now available"
    },
    {
      title: "Mobile App Launch",
      description: "Download our new mobile app for iOS and Android"
    },
    {
      title: "Partnership Announcement",
      description: "We've partnered with 10 new venture capital firms"
    }
  ]

  const nextUpdate = () => {
    setCurrentUpdate((prev) => (prev + 1) % updates.length)
  }

  const prevUpdate = () => {
    setCurrentUpdate((prev) => (prev - 1 + updates.length) % updates.length)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background opacity-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0YzAgMi4yMS0xLjc5IDQtNC00cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-5" />
        <div className="max-w-screen-xl mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center flex items-center justify-center min-h-[50vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.21, 0.45, 0.32, 0.9]
              }}
              className="w-full relative z-30"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 text-foreground relative z-40">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.45, 0.32, 0.9] }}
                  className="relative z-50"
                >
                  <GradientText
                    colors={["#FFFFFF", "#8E8E8E", "#FFFFFF", "#8E8E8E", "#FFFFFF"]}
                    animationSpeed={7.5}
                    showBorder={false}
                    className="font-['Helvetica',sans-serif] font-thin tracking-widest"
                  >
                    pLantum
                  </GradientText>
                </motion.div>
              </h1>
            </motion.div>
          </div>
        </div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
      </section>

      {/* Latest Updates Notification */}
      <div className="max-w-screen-xl mx-auto px-4 -mt-16 relative z-30">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Latest Updates ({currentUpdate + 1}/{updates.length})</Badge>
                  <div>
                    <h3 className="font-semibold text-sm">{updates[currentUpdate].title}</h3>
                    <p className="text-xs text-muted-foreground">{updates[currentUpdate].description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={prevUpdate}>
                    <ArrowUpRight className="h-4 w-4 rotate-180" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={nextUpdate}>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mt-4">
          {isLoading ? (
              // Show skeletons while loading
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                      <CardHeader className="pb-2">
                          <Skeleton className="h-4 w-24" />
                      </CardHeader>
                      <CardContent>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                      </CardContent>
                    </Card>
              ))
          ) : (
            // Show actual metrics
            platformMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="pb-1">
                  <div className="flex items-center gap-2">
                    {metric.icon}
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                      </div>
                    </CardHeader>
                <CardContent className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-1 text-emerald-500 font-medium bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-sm">{metric.change}</span>
                        </div>
                      </div>
                  <span className="text-xs text-muted-foreground">{metric.description}</span>
                    </CardContent>
                  </Card>
              ))
            )}
          </div>
        </div>

      {/* Total Users Count */}
      <div className="max-w-screen-xl mx-auto px-4 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg font-medium text-muted-foreground">2,345 Total Users</p>
        </div>
      </div>

      {/* Create Post Section */}
      <div className="max-w-screen-xl mx-auto px-4 mt-8">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="What's on your mind?"
                  className="resize-none border-none focus-visible:ring-0 p-0"
                  rows={1}
                />
              </div>
            </CardHeader>
            {(selectedMedia.length > 0 || selectedDocuments.length > 0) && (
              <CardContent className="px-6 py-3 border-b">
                <div className="space-y-3">
                  {/* Media Previews */}
                  {selectedMedia.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedMedia.map((file, index) => {
                        const previewUrl = mediaPreviewUrls[index]
                        const FileIcon = getFileTypeIcon(file)
                        const isImage = file.type.startsWith("image/")
                        const isVideo = file.type.startsWith("video/")
                        
                        return (
                          <div
                            key={`media-${index}`}
                            className="relative group border rounded-lg overflow-hidden bg-muted/50"
                          >
                            {isImage && previewUrl ? (
                              <div className="relative w-24 h-24 min-w-[96px] min-h-[96px] border rounded-lg overflow-hidden bg-background flex-shrink-0">
                                <img
                                  src={previewUrl}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                  style={{ display: 'block', width: '100%', height: '100%' }}
                                  onError={(e) => {
                                    console.error('Image failed to load:', previewUrl)
                                    // Fallback to icon if image fails to load
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 bg-background/90 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                                  onClick={() => handleRemoveMedia(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="w-24 h-24 flex flex-col items-center justify-center p-2">
                                <FileIcon className="h-8 w-8 text-muted-foreground mb-1" />
                                <p className="text-xs text-muted-foreground truncate w-full text-center">
                                  {file.name.length > 12 ? file.name.substring(0, 12) + "..." : file.name}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleRemoveMedia(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                  
                  {/* Document Previews */}
                  {selectedDocuments.length > 0 && (
                    <div className="space-y-2">
                      {selectedDocuments.map((file, index) => (
                        <div
                          key={`doc-${index}`}
                          className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50 group"
                        >
                          <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)} • {file.type || "Document"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveDocument(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            )}
            <CardFooter className="flex justify-between border-t px-6 py-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleAddMediaClick} type="button">
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 15h18" />
                    <path d="M9 9h.01" />
                    <path d="M15 9h.01" />
                  </svg>
                  Add Media
                </Button>
                <input
                  type="file"
                  ref={mediaInputRef}
                  onChange={handleMediaSelect}
                  className="hidden"
                  accept="image/*,video/*,audio/*"
                  multiple
                />
                <Button variant="outline" size="sm" onClick={handleAddDocumentClick} type="button">
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Add Document
                </Button>
                <input
                  type="file"
                  ref={documentInputRef}
                  onChange={handleDocumentSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                  multiple
                />
              </div>
              <Button>Post</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Social Feed */}
      <div className="max-w-screen-xl mx-auto px-4 mt-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
          <div className="space-y-6">
            {isLoading ? (
              // Show skeletons while loading
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-start gap-4 pb-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="grid gap-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                </div>
              </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
                ))
            ) : (
              // Show actual feed items
              feedItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <Avatar>
                      <AvatarImage src={item.author.avatar} />
                      <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                          </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.author.name}</span>
                        <Badge variant="outline">{item.author.role}</Badge>
                          </div>
                      <div className="text-sm text-muted-foreground">{item.timestamp}</div>
                        </div>
              </CardHeader>
                  <CardContent>
                    <p className="mb-4">{item.content}</p>
                    {item.type === "funding" && item.funding && (
                      <div className="rounded-lg border bg-muted/40 p-4 mb-4">
                        <div className="font-semibold">Funding Update</div>
                        <p className="text-sm text-muted-foreground">
                          {item.funding.round} round: {item.funding.amount}
                          <br />
                          Lead investor: {item.funding.lead}
                        </p>
                          </div>
                    )}
                    {item.type === "event" && item.event && (
                      <div className="rounded-lg border bg-muted/40 p-4 mb-4">
                        <div className="font-semibold mb-2">{item.event.title}</div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{item.event.date} at {item.event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{item.event.location}</span>
                        </div>
              <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4" />
                            <span>{item.event.tickets.available} tickets available - {item.event.tickets.price}</span>
              </div>
                          <Button className="w-full mt-2" size="sm">
                            Register Now
                </Button>
              </div>
            </div>
          )}
                    <div className="flex items-center gap-4 border-t pt-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`gap-2 transition-all duration-300 ${
                          likedPosts.has(item.id) 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'hover:text-red-500'
                        }`}
                        onClick={() => {
                          const isCurrentlyLiked = likedPosts.has(item.id)
                          setLikedPosts((prev) => {
                            const newSet = new Set(prev)
                            if (newSet.has(item.id)) {
                              newSet.delete(item.id)
                            } else {
                              newSet.add(item.id)
                            }
                            return newSet
                          })
                          // Update like count
                          setLikeCounts((prev) => {
                            const currentCount = prev[item.id] ?? item.stats.likes
                            return {
                              ...prev,
                              [item.id]: isCurrentlyLiked ? currentCount - 1 : currentCount + 1
                            }
                          })
                        }}
                      >
                        <motion.div
                          animate={{
                            scale: likedPosts.has(item.id) ? [1, 1.3, 1] : 1,
                          }}
                          transition={{
                            duration: 0.4,
                            ease: "easeOut",
                          }}
                        >
                          <Heart 
                            className={`h-4 w-4 transition-all duration-300 ${
                              likedPosts.has(item.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'fill-transparent'
                            }`}
                          />
                        </motion.div>
                        {likeCounts[item.id] ?? item.stats.likes}
          </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`gap-2 hover:text-blue-500 ${
                          openCommentPostId === item.id ? 'text-blue-500' : ''
                        }`}
                        onClick={() => {
                          setOpenCommentPostId(openCommentPostId === item.id ? null : item.id)
                          // Initialize comments if not already loaded
                          if (!comments[item.id]) {
                            // Generate unique mock comments for this post
                            const mockComments = generateMockComments(item.id, item.type, item.content)
                            setComments(prev => ({
                              ...prev,
                              [item.id]: mockComments
                            }))
                          }
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                        {item.stats.comments}
          </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2 hover:text-green-500"
                        onClick={async () => {
                          try {
                            // Create a shareable URL for this post
                            const postUrl = `${window.location.origin}/post/${item.id}`
                            const shareText = `${item.author.name}: ${item.content.substring(0, 100)}${item.content.length > 100 ? '...' : ''}`
                            
                            let shareSuccessful = false
                            
                            // Try native share API first (mobile/desktop with share support)
                            if (navigator.share) {
                              try {
                                await navigator.share({
                                  title: `Post by ${item.author.name}`,
                                  text: shareText,
                                  url: postUrl,
                                })
                                shareSuccessful = true
                                toast.success('Post shared successfully!')
                              } catch (shareError: any) {
                                // User cancelled share - don't increment
                                if (shareError.name === 'AbortError') {
                                  return
                                }
                                throw shareError
                              }
                            } else {
                              // Fallback to clipboard
                              await navigator.clipboard.writeText(postUrl)
                              shareSuccessful = true
                              toast.success('Post link copied to clipboard!')
                            }
                            
                            // Increment share count on successful share
                            if (shareSuccessful) {
                              setShareCounts((prev) => {
                                const currentCount = prev[item.id] ?? item.stats.shares
                                return {
                                  ...prev,
                                  [item.id]: currentCount + 1
                                }
                              })
                            }
                          } catch (error: any) {
                            // User cancelled share or error occurred
                            if (error.name !== 'AbortError') {
                              // If clipboard API fails, try fallback method
                              try {
                                const postUrl = `${window.location.origin}/post/${item.id}`
                                const textArea = document.createElement('textarea')
                                textArea.value = postUrl
                                textArea.style.position = 'fixed'
                                textArea.style.left = '-999999px'
                                document.body.appendChild(textArea)
                                textArea.select()
                                document.execCommand('copy')
                                document.body.removeChild(textArea)
                                
                                // Increment share count on successful fallback share
                                setShareCounts((prev) => {
                                  const currentCount = prev[item.id] ?? item.stats.shares
                                  return {
                                    ...prev,
                                    [item.id]: currentCount + 1
                                  }
                                })
                                
                                toast.success('Post link copied to clipboard!')
                              } catch (fallbackError) {
                                console.error('Error sharing post:', fallbackError)
                                toast.error('Failed to share post. Please try again.')
                              }
                            }
                          }
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                        {shareCounts[item.id] ?? item.stats.shares}
          </Button>
        </div>
                    {/* Comment Section */}
                    {openCommentPostId === item.id && (
                      <div className="border-t pt-4 mt-4 space-y-4">
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {comments[item.id] && comments[item.id].length > 0 ? (
                            comments[item.id].map((comment) => (
                              <div key={comment.id} className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.author.avatar} />
                                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">{comment.author.name}</span>
                                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-foreground">{comment.content}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
                          )}
                        </div>
                        {/* Add Comment Form */}
                        <div className="flex items-start gap-3 pt-2 border-t">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="Write a comment..."
                              value={newComment[item.id] || ""}
                              onChange={(e) => setNewComment(prev => ({ ...prev, [item.id]: e.target.value }))}
                              className="resize-none min-h-[60px] text-sm"
                              rows={2}
                            />
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                onClick={() => {
                                  const commentText = newComment[item.id]?.trim()
                                  if (commentText) {
                                    const newCommentObj = {
                                      id: Date.now(),
                                      author: { name: "You", avatar: "/placeholder-user.jpg" },
                                      content: commentText,
                                      timestamp: "just now"
                                    }
                                    setComments(prev => ({
                                      ...prev,
                                      [item.id]: [newCommentObj, ...(prev[item.id] || [])]
                                    }))
                                    setNewComment(prev => ({ ...prev, [item.id]: "" }))
                                    // In production, you would call the API here
                                    // await fetch(`/api/posts/${item.id}/comments`, { method: 'POST', body: JSON.stringify({ content: commentText }) })
                                  }
                                }}
                                disabled={!newComment[item.id]?.trim()}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
        </div>
        </div>
      </div>
    </div>
  )
}