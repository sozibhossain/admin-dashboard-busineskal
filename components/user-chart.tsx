'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type JoiningPoint = {
  period: number
  count: number
}

type JoiningReport = {
  users?: JoiningPoint[]
  sellers?: JoiningPoint[]
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

const normalizeJoiningData = (report?: JoiningReport) => {
  const period = report?.period || 'month'
  const map = new Map<number, { label: string; order: number; user?: number; seller?: number }>()

  const addPoints = (points: JoiningPoint[] | undefined, key: 'user' | 'seller') => {
    if (!points) return
    points.forEach((point) => {
      const order = Number(point.period)
      const label = formatLabel(period, order)
      const current = map.get(order) || { label, order }
      current[key] = point.count
      map.set(order, current)
    })
  }

  addPoints(report?.users, 'user')
  addPoints(report?.sellers, 'seller')

  return Array.from(map.values())
    .sort((a, b) => a.order - b.order)
    .map(({ order, ...rest }) => rest)
}

export function UserChart({
  data,
  period,
  onPeriodChange,
}: {
  data?: JoiningReport
  period: 'day' | 'week' | 'month' | 'year'
  onPeriodChange: (value: 'day' | 'week' | 'month' | 'year') => void
}) {
  const chartData = normalizeJoiningData(data)
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          User and Seller Joining Report
        </h3>
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
          <div className="w-3 h-3 rounded-full bg-violet-500"></div>
          <span className="text-sm text-slate-600">User</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <span className="text-sm text-slate-600">Seller</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSeller" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Area
            type="monotone"
            dataKey="user"
            stroke="#a78bfa"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorUser)"
            strokeDasharray="5 5"
          />
          <Area
            type="monotone"
            dataKey="seller"
            stroke="#f43f5e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSeller)"
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
