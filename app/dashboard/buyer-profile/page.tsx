'use client'

import { useState } from 'react'
import { useBuyersQuery } from '@/lib/hooks/queries'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TableSkeleton } from '@/components/table-skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function BuyerProfilePage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 10

  const { data, isLoading } = useBuyersQuery({
    page,
    limit,
    search,
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Buyer Profile</h1>
          <p className="text-sm text-slate-600 mt-1">Dashboard › User Profile</p>
        </div>
        <Card className="bg-amber-600 border-amber-600">
          <CardContent className="pt-6">
            <div className="text-white">
              <p className="text-sm font-medium">Total User</p>
              <p className="text-2xl font-bold">{data?.total || '0'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search buyers..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">User ID</TableHead>
                  <TableHead className="font-semibold">Buyer Name</TableHead>
                  <TableHead className="font-semibold">Total Order</TableHead>
                  <TableHead className="font-semibold">Delivered Order</TableHead>
                  <TableHead className="font-semibold">Activity log</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data && data.data.length > 0 ? (
                  data.data.map((buyer: any) => (
                    <TableRow key={buyer.id} className="hover:bg-slate-50">
                      <TableCell className="text-slate-600">{buyer.id}</TableCell>
                      <TableCell className="font-medium">{buyer.name}</TableCell>
                      <TableCell className="text-slate-600">{buyer.totalOrders || '0'}</TableCell>
                      <TableCell className="text-slate-600">{buyer.deliveredOrders || '0'}</TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {buyer.status || 'Active'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                      No buyers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Info */}
        {!isLoading && data && (
          <div className="mt-6 text-sm text-slate-600">
            Showing {Math.min((page - 1) * limit + 1, data.total)} to {Math.min(page * limit, data.total)} of {data.total} results
          </div>
        )}
      </div>
    </div>
  )
}
