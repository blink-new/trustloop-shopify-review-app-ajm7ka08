import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface AnalyticsChartProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    period: string
  }
  icon?: React.ReactNode
  color?: string
}

export default function AnalyticsChart({ 
  title, 
  value, 
  description, 
  trend,
  icon,
  color = 'blue'
}: AnalyticsChartProps) {
  const trendIcon = useMemo(() => {
    if (!trend) return null
    
    switch (trend.type) {
      case 'increase':
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'decrease':
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Minus className="h-3 w-3 text-gray-400" />
    }
  }, [trend])

  const trendColor = useMemo(() => {
    if (!trend) return 'text-gray-600'
    
    switch (trend.type) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }, [trend])

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600'
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon && <div className={colorClasses[color as keyof typeof colorClasses]}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
        {trend && (
          <div className={`text-xs ${trendColor} flex items-center gap-1 mt-1`}>
            {trendIcon}
            <span>{trend.value > 0 ? '+' : ''}{trend.value}% {trend.period}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}