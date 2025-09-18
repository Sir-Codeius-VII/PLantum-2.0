"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { createIntersectionObserver } from "@/lib/performance"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

export const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    className,
    priority = false,
    quality = 75,
    placeholder = "empty",
    blurDataURL,
    sizes,
    fill = false,
    style,
    onLoad,
    onError,
    ...props
  }, ref) => {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [isInView, setIsInView] = React.useState(priority)
    const [hasError, setHasError] = React.useState(false)
    const imgRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (priority || isInView) return

      const observer = createIntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true)
              observer?.disconnect()
            }
          })
        },
        { rootMargin: '50px' }
      )

      if (observer && imgRef.current) {
        observer.observe(imgRef.current)
      }

      return () => {
        observer?.disconnect()
      }
    }, [priority, isInView])

    const handleLoad = React.useCallback(() => {
      setIsLoaded(true)
      onLoad?.()
    }, [onLoad])

    const handleError = React.useCallback(() => {
      setHasError(true)
      onError?.()
    }, [onError])

    if (hasError) {
      return (
        <div
          ref={imgRef}
          className={cn(
            "flex items-center justify-center bg-muted text-muted-foreground",
            className
          )}
          style={fill ? { width: '100%', height: '100%' } : { width, height }}
        >
          <span className="text-sm">Failed to load image</span>
        </div>
      )
    }

    return (
      <div
        ref={imgRef}
        className={cn("relative overflow-hidden", className)}
        style={fill ? { width: '100%', height: '100%' } : { width, height }}
      >
        {!isInView && !priority && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        
        {isInView && (
          <Image
            ref={ref}
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            priority={priority}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            sizes={sizes}
            style={style}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            {...props}
          />
        )}
      </div>
    )
  }
)
OptimizedImage.displayName = "OptimizedImage"

// Lazy loading image with skeleton
export const LazyImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  (props, ref) => {
    return (
      <OptimizedImage
        {...props}
        ref={ref}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
    )
  }
)
LazyImage.displayName = "LazyImage"
