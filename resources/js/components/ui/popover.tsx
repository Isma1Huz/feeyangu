"use client"

import React, { useState, useRef, useEffect } from "react"

interface PopoverProps {
  children: React.ReactNode
}

export const Popover: React.FC<PopoverProps> = ({ children }) => {
  return <div className="relative inline-block">{children}</div>
}

interface PopoverTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, asChild }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
      "aria-expanded": isOpen,
    })
  }

  return <div onClick={handleClick}>{children}</div>
}

interface PopoverContentProps {
  children: React.ReactNode
  className?: string
  align?: "start" | "center" | "end"
  sideOffset?: number
}

export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  className = "",
  align = "center",
  sideOffset = 4,
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div
      ref={contentRef}
      className={`absolute mt-${sideOffset} ${
        align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 transform -translate-x-1/2"
      } ${className}`}
    >
      {children}
    </div>
  )
}

