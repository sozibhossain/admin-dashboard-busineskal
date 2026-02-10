'use client'

import { useState } from 'react'
import { useSellersQuery } from '@/lib/hooks/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TableSkeleton } from '@/components/table-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SellerProfilePage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 10

  const { data, isLoading } = useSellersQuery({
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Seller Profile</h1>
          <p className="text-sm text-slate-600 mt-1">Dashboard › Seller Profile</p>
        </div>
        <Card className="bg-amber-600 border-amber-600">
          <CardContent className="pt-6">
            <div className="text-white">
              <p className="text-sm font-medium">Total Seller</p>
              <p className="text-2xl font-bold">{data?.total || '0'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search sellers..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton rows={5} columns={3} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">Seller ID</TableHead>
                  <TableHead className="font-semibold">Seller Name</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data && data.data.length > 0 ? (
                  data.data.map((seller: any) => (
                    <TableRow key={seller.id} className="hover:bg-slate-50">
                      <TableCell className="text-slate-600">{seller.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                            <AvatarFallback>{seller.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{seller.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="text-amber-600 border-amber-200 hover:bg-amber-50 bg-transparent">
                          See Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-slate-500 py-8">
                      No sellers found
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
