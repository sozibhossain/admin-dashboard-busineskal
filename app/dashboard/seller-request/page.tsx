'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import {
  useSellerRequestsQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
} from '@/lib/hooks/queries'
import { Input } from '@/components/ui/input'
import { TableSkeleton } from '@/components/table-skeleton'

export default function SellerRequestPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 10

  const { data, isLoading } = useSellerRequestsQuery({
    page,
    limit,
    search,
  })
  const approveSeller = useApproveSellerMutation()
  const rejectSeller = useRejectSellerMutation()

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Seller Profile Request</h1>
        <p className="text-sm text-slate-600 mt-1">Dashboard â€º Seller Profile Request</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <Input
            placeholder="Search sellers..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} columns={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Shop
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
                {data?.data && data.data.length > 0 ? (
                  data.data.map((request: any) => (
                    <tr
                      key={request.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {request.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {request.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {request.shop || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {request.date
                          ? new Date(request.date).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                          onClick={() => approveSeller.mutate(request.id)}
                          disabled={approveSeller.isPending}
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          onClick={() => rejectSeller.mutate(request.id)}
                          disabled={rejectSeller.isPending}
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-slate-500" colSpan={5}>
                      No seller requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
