"use client"

import Link from "next/link"
import GradientText from "@/components/ui/gradient-text"

export default function SiteLogo() {
  return (
    <Link href="/" aria-label="PLantum" className="flex items-center">
      <GradientText
        colors={["#ECECEC", "#8E8E8E", "#8E8E8E", "#8E8E8E", "#ECECEC"]}
        animationSpeed={9}
        showBorder={false}
        animate={false}
        className="text-lg md:text-xl lg:text-2xl font-['Helvetica',sans-serif] font-thin tracking-widest"
      >
        pLantum
      </GradientText>
    </Link>
  )
}