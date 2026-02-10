'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type RevenuePoint = {
  _id: number
  revenue: number
}

type RevenueReport = {
  thisMonth?: RevenuePoint[]
  lastMonth?: RevenuePoint[]
  period?: 'day' | 'week' | 'month' | 'year'
}

const periodLabels: Record<'day' | 'week' | 'month' | 'year', string[]> = {
  day: [],
  week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  month: [],
  year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

const formatLabel = (period: 'day' | 'week' | 'month' | 'year', value: number) => {
  if (period === 'day') {
    return `${String(value).padStart(2, '0')}:00`
  }
  if (period === 'week') {
    return periodLabels.week[value - 1] || String(value)
  }
  if (period === 'year') {
    return periodLabels.year[value - 1] || String(value)
  }
  return String(value)
}

const normalizeRevenueData = (report?: RevenueReport) => {
  const period = report?.period || 'month'
  const map = new Map<number, { date: string; order: number; thisMonth?: number; lastMonth?: number }>()

  const addPoints = (points: RevenuePoint[] | undefined, key: 'thisMonth' | 'lastMonth') => {
    if (!points) return
    points.forEach((point) => {
      const order = Number(point._id)
      const date = formatLabel(period, order)
      const current = map.get(order) || { date, order }
      current[key] = point.revenue
      map.set(order, current)
    })
  }

  addPoints(report?.thisMonth, 'thisMonth')
  addPoints(report?.lastMonth, 'lastMonth')

  return Array.from(map.values())
    .sort((a, b) => a.order - b.order)
    .map(({ order, ...rest }) => rest)
}

export function RevenueChart({
  data,
  period,
  onPeriodChange,
}: {
  data?: RevenueReport
  period: 'day' | 'week' | 'month' | 'year'
  onPeriodChange: (value: 'day' | 'week' | 'month' | 'year') => void
}) {
  const chartData = normalizeRevenueData(data)
  const periodLabel = period.charAt(0).toUpperCase() + period.slice(1)
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Revenue Report</h3>
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'year'] as const).map((option) => (
            <button
              key={option}
              onClick={() => onPeriodChange(option)}
              className={`px-3 py-1 text-xs font-medium rounded ${
                option === period
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-600"></div>
          <span className="text-sm text-slate-600">This {periodLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-sky-500"></div>
          <span className="text-sm text-slate-600">Last {periodLabel}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="thisMonth"
            stroke="#b45309"
            strokeWidth={2}
            dot={{ fill: '#b45309', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="lastMonth"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ fill: '#0ea5e9', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
