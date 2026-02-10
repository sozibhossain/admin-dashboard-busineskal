'use client'

import { useState } from 'react'
import { useSellersQuery } from '@/lib/hooks/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TableSkeleton } from '@/components/table-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function SellerProfilePage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 10

  const { data, isLoading } = useSellersQuery({
    page,
    limit,
    search,
  })
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-amber-600 border-amber-200 hover:bg-amber-50 bg-transparent"
                          onClick={() => handleOpenDetails(seller)}
                        >
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

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Seller Details</DialogTitle>
          </DialogHeader>
          {selectedSeller?.raw ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={selectedSeller.raw.avatar?.url || "/placeholder.svg"} />
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
