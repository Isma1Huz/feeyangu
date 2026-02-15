import type React from "react"
import { X } from 'lucide-react'
import { cn } from "@/lib/utils"

interface NoticeProps {
  children: React.ReactNode
  variant?: "warning" 
  className?: string
  onClose?: () => void
}

export const Notice: React.FC<NoticeProps> = ({ 
  children, 
  className,
  onClose 
}) => {
  return (
    <div className={cn(
      "border-2 mb-6 p-4 relative border-red-300 text-[12px] md:text-[16px] sm:w-[80%] lg:w-full md:w-[80%] md:mx-auto", 
      className
    )}>
      {onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-1 right-1  md:top-2 md:right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className="space-y-2 ">
        {children}
      </div>
    </div>
  )
}
