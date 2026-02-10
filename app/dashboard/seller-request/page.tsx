'use client'

import { useState } from 'react'
import { Check, Trash2, X } from 'lucide-react'
import {
  useSellerRequestsQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
} from '@/lib/hooks/queries'
import { Input } from '@/components/ui/input'
import { TableSkeleton } from '@/components/table-skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<any>(null)

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleOpenDetails = (seller: any) => {
    setSelectedSeller(seller)
    setIsDetailsOpen(true)
  }

  const renderStatus = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-700'
    if (status === 'rejected') return 'bg-red-100 text-red-700'
    return 'bg-amber-100 text-amber-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Seller Profile Request</h1>
          <p className="text-sm text-slate-600 mt-1">Dashboard â€º Seller Profile Request</p>
        </div>
        <div className="bg-amber-700 text-white px-4 py-3 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-wide">Total Request</p>
          <p className="text-lg font-semibold">{data?.total || 0}</p>
        </div>
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
            <TableSkeleton rows={5} columns={4} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Seller ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Seller Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Request date
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
                      <td className="px-6 py-4 text-sm text-slate-700">{request.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={request.raw?.avatar?.url || '/placeholder.svg'} />
                            <AvatarFallback>{request.name?.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{request.name}</p>
                            <p className="text-xs text-slate-500">{request.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {request.date ? new Date(request.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${renderStatus(
                            request.raw?.vendorStatus
                          )}`}
                        >
                          {request.raw?.vendorStatus || 'pending'}
                        </span>
                        <button
                          className="text-green-600 text-sm underline"
                          onClick={() => handleOpenDetails(request)}
                        >
                          See Details
                        </button>
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
                        <button className="p-2 hover:bg-amber-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-amber-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-slate-500" colSpan={4}>
                      No seller requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Seller Details</DialogTitle>
          </DialogHeader>
          {selectedSeller?.raw ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={selectedSeller.raw.avatar?.url || '/placeholder.svg'} />
                  <AvatarFallback>{selectedSeller.raw.name?.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{selectedSeller.raw.name}</p>
                  <p className="text-sm text-slate-500">{selectedSeller.raw.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Seller ID</p>
                  <p className="text-slate-900 font-medium">{selectedSeller.raw._id}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <p className="text-slate-900 font-medium">{selectedSeller.raw.vendorStatus}</p>
                </div>
                <div>
                  <p className="text-slate-500">Role</p>
                  <p className="text-slate-900 font-medium">{selectedSeller.raw.role}</p>
                </div>
                <div>
                  <p className="text-slate-500">Created</p>
                  <p className="text-slate-900 font-medium">
                    {new Date(selectedSeller.raw.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">No details available.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
