'use client'

import { useState } from 'react'
import { useProductsQuery, useApproveProductMutation } from '@/lib/hooks/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TableSkeleton } from '@/components/table-skeleton'
import { CheckCircle2, Trash2 } from 'lucide-react'

export default function RequestProductPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 5

  const { data, isLoading } = useProductsQuery({
    page,
    limit,
    search,
  })
  const approveProduct = useApproveProductMutation()

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Request Product</h1>
        <p className="text-sm text-slate-600 mt-1">Dashboard › Request Product › Product</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {/* Header */}
        <div className="mb-6">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">Product Name</TableHead>
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Price</TableHead>
                  <TableHead className="font-semibold">Quantity</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data && data.data.length > 0 ? (
                  data.data.map((product: any) => (
                    <TableRow key={product.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={product.image || "/placeholder.svg"} alt={product.name} />
                            <AvatarFallback>{product.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{product.productId}</TableCell>
                      <TableCell className="text-slate-600">{product.price}</TableCell>
                      <TableCell className="text-slate-600">{product.quantity}</TableCell>
                      <TableCell className="text-slate-600">{product.date}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                          onClick={() => approveProduct.mutate(product.id)}
                          disabled={approveProduct.isPending}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                      No products found
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
            Showing {data.data?.length || 0} to {Math.min(page * limit, data.total)} of {data.total} results
          </div>
        )}
      </div>
    </div>
  )
}
