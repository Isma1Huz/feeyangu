import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-3 border  shadow-sm bg-white">
        <Icon className="h-5 w-5 text-gray-600" />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}

