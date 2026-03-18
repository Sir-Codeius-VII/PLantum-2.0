"use client"

import * as React from "react"
import styles from "./gradient-text.module.css"

type GradientTextProps = {
  children: React.ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number
  showBorder?: boolean
  animate?: boolean
}

export default function GradientText({
  children,
  className = "",
  colors = ["#ECECEC", "#8E8E8E", "#ECECEC", "#8E8E8E", "#ECECEC"],
  animationSpeed = 9,
  showBorder = false,
  animate = true,
}: GradientTextProps) {
  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  }

  if (!animate) {
    gradientStyle.animation = "none"
  }

  return (
    <div className={`${styles.animatedGradientText} ${showBorder ? styles.withBorder : ''} ${className}`}>
      {showBorder && <div className={styles.gradientOverlay} style={gradientStyle} />}
      <div className={styles.textContent} style={gradientStyle}>
        {children}
      </div>
    </div>
  )
}