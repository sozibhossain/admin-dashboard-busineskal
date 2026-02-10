'use client'

import { useState } from 'react'
import { useOverviewQuery, useRevenueReportQuery, useUserReportQuery } from '@/lib/hooks/queries'
import { KPICard } from '@/components/kpi-card'
import { RevenueChart } from '@/components/revenue-chart'
import { UserChart } from '@/components/user-chart'
import { KPISkeleton } from '@/components/kpi-skeleton'
import { ChartSkeleton } from '@/components/chart-skeleton'

export default function DashboardPage() {
  const [revenuePeriod, setRevenuePeriod] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [userPeriod, setUserPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const { data: overview, isLoading: overviewLoading } = useOverviewQuery()
  const { data: revenueData, isLoading: revenueLoading } = useRevenueReportQuery(revenuePeriod)
  const { data: userData, isLoading: userLoading } = useUserReportQuery(userPeriod)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Over View</h1>
        <p className="text-sm text-slate-600 mt-1">Dashboard</p>
      </div>

      {/* KPI Cards */}
      {overviewLoading ? (
        <KPISkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Total Revenue"
            value={overview?.totalRevenue || '0'}
            icon="📈"
            trend={overview?.revenueTrend || 5.2}
          />
          <KPICard
            title="Total Seller"
            value={overview?.totalSellers || '0'}
            icon="👥"
            trend={overview?.sellerTrend || 3.5}
          />
          <KPICard
            title="Total User"
            value={overview?.totalUsers || '0'}
            icon="👤"
            trend={overview?.userTrend || 2.8}
          />
        </div>
      )}

      {/* Charts */}
      <div className="space-y-6">
        {revenueLoading ? (
          <ChartSkeleton />
        ) : (
          <RevenueChart
            data={revenueData}
            period={revenuePeriod}
            onPeriodChange={setRevenuePeriod}
          />
        )}
        {userLoading ? (
          <ChartSkeleton />
        ) : (
          <UserChart
            data={userData}
            period={userPeriod}
            onPeriodChange={setUserPeriod}
          />
        )}
      </div>
    </div>
  )
}
