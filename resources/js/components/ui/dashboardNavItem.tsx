/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { Link, router } from "@inertiajs/react" 
import { cn } from "@/lib/utils"
import { useState } from "react"
import { NavItem } from "@/types/dashboard"
import { ActiveSubscription } from "@/types/landing/pagesTypes"
import { getSubscriptionStatus, isRestrictedTab } from "@/hooks/general"

interface DashboardNavItemProps {
  item: NavItem
  onclose: () => void
  index: number
  totalItems: number
  isPublished: boolean
  isMobile?: boolean
  activeSubscription?: ActiveSubscription | null
}

export function DashboardNavItem({
  item,
  index,
  totalItems,
  isPublished,
  onclose,
  isMobile = false,
  activeSubscription,
}: DashboardNavItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isActive = window.location.pathname === item.href

  const { isFreeStarter, isPremiumOrEnterprise, metadata } = getSubscriptionStatus(activeSubscription)
  const isDisabled = isRestrictedTab(isPublished, isFreeStarter, item.label, item.href)


  const handleSectionClick = (sectionKey: string) => {
    if (!isDisabled) {
      router.visit(`${item.href}?sec=${sectionKey}`, { method: "get" })
    }
  }

const linkContent = (
  <Link
    className={cn(
      "text-gray-700 text-[15px] font-medium px-6 py-4 h-16 text-center flex items-center justify-center text-base relative",
      isActive && "bg-gray-200 font-bold",
      isDisabled
        ? "opacity-50 cursor-not-allowed pointer-events-none"
        : "hover:text-gray-900",
      item.highlight && "text-red-500 hover:text-red-600",
      isMobile && "justify-start px-0 h-auto py-2"
    )}
    href={isDisabled ? "#" : item.href}
  >
    <span className="relative inline-flex items-center">
      {item.label}

      {item.count && item.count > 0 && (
        <span className="absolute -top-4 text-md -right-3 min-w-[16px] h-[16px] p-1.5 text-[12px] font-semibold text-white bg-primary rounded-full flex items-center justify-center shadow-sm">
          {item.count}
        </span>
      )}
    </span>
  </Link>
)


  const contentWrapper = (
    <div
      className={cn(
        "bg-white py-2 z-50",
        !isMobile && "absolute mt-0 shadow-lg border border-gray-200",
        !isMobile && (index >= totalItems - 3 ? "right-4" : "left-6"),
        !isMobile && (index === 2 || index === 5 || index === 1 ? "w-[400px]" : index === 0 ? "w-[160px]" : "w-80"),
        isMobile && "mt-2"
      )}
    >
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-4">
          {item.icon && <item.icon className="h-5 w-5 text-red-500" />}
          <h3 className="text-sm font-semibold text-red-500">{item.content.title}</h3>
        </div>
        <div className="space-y-4">
          {item.content.sections?.map((section, idx) => (
            <div
              key={idx}
              className={cn(
                "group cursor-pointer",
                isDisabled && "opacity-50 cursor-not-allowed pointer-events-none"
              )}
              onClick={() => {
                if (!isDisabled) {
                  handleSectionClick(section.key)
                  setIsHovered(false)
                  onclose()
                }
              }}
            >
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-500 transition-colors">
                {section.heading}
              </h4>
              <p className="text-sm text-gray-500 mt-1">{section.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return <div className="bg-gray-50 px-4 py-2">{!isDisabled && contentWrapper}</div>
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => !isDisabled && setIsHovered(false)}
    >
      {linkContent}
      {isHovered && !isDisabled && contentWrapper}
    </div>
  )
}


