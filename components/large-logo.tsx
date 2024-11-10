import Image from "next/image"

import { cn } from "@/lib/utils"

interface LargeLogoProps {
  className?: string
  dinamicColor?: boolean
}

export function LargeLogo({ className, dinamicColor = true }: LargeLogoProps) {
  return (
    <div className={cn("select-none flex items-center gap-2", className)}>
      {!dinamicColor && (
        <Image
          src="/icons/SafeAlert-logo.svg"
          alt="Logo de SafeAlert"
          width={40}
          height={40}
          className="size-[35px] shrink-0"
        />
      )}
      {dinamicColor && (
        <Image
          src="/icons/color-logo-2.svg"
          alt="Logo de SafeAlert"
          width={40}
          height={40}
          className="size-[35px] shrink-0"
        />
      )}
      <span
        className={cn(
          "text-[16px] tracking-wider max-sm:hidden",
          !dinamicColor && "text-white"
        )}
      >
        CorrtMail
      </span>
    </div>
  )
}