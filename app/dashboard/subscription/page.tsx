'use client'

import { Trash2 } from 'lucide-react'
import { useSubscriptionsQuery, useDeleteSubscriptionMutation } from '@/lib/hooks/queries'

export default function SubscriptionPage() {
  const { data, isLoading } = useSubscriptionsQuery()
  const deleteSubscription = useDeleteSubscriptionMutation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Subscription Plans</h1>
          <p className="text-sm text-slate-600 mt-1">Dashboard â€º Subscription</p>
        </div>
        <button className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
          Add Plan
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Plan Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Price (Monthly)
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Price (Yearly)
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Features
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-500" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : data?.data && data.data.length > 0 ? (
                data.data.map((sub: any) => (
                  <tr
                    key={sub.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-slate-700">{sub.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {sub.pricePerMonth ?? '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {sub.pricePerYear ?? '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {Array.isArray(sub.features) ? sub.features.join(', ') : sub.features || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {sub.date ? new Date(sub.date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        onClick={() => deleteSubscription.mutate(sub.id)}
                        disabled={deleteSubscription.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-slate-500" colSpan={6}>
                    No subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
