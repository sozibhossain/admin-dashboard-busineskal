'use client'

import { useState } from 'react'
import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
  useCategoryMutation,
} from '@/lib/hooks/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TableSkeleton } from '@/components/table-skeleton'
import { Edit2, Trash2, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function CategoriesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 10

  const { data, isLoading } = useCategoriesQuery({
    page,
    limit,
    search,
  })
  const deleteCategory = useDeleteCategoryMutation()
  const saveCategory = useCategoryMutation()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    parent: '',
  })

  const handleDelete = (category: any) => {
    setSelectedCategory(category)
    setIsDeleteOpen(true)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleOpenCreate = () => {
    setSelectedCategory(null)
    setFormData({ name: '', color: '', parent: '' })
    setIsFormOpen(true)
  }

  const handleOpenEdit = (category: any) => {
    setSelectedCategory(category)
    setFormData({
      name: category?.name || '',
      color: category?.raw?.color || '',
      parent: category?.raw?.parent?._id || '',
    })
    setIsFormOpen(true)
  }

  const handleSubmit = () => {
    const payload: any = {
      name: formData.name,
      color: formData.color,
    }
    if (formData.parent) payload.parent = formData.parent

    saveCategory.mutate(
      { id: selectedCategory?.id, payload },
      {
        onSuccess: () => {
          setIsFormOpen(false)
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categories List</h1>
          <p className="text-sm text-slate-600 mt-1">Dashboard › Categories › List</p>
        </div>
        <Button
          className="bg-amber-600 hover:bg-amber-700 text-white"
          onClick={handleOpenCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Categories
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search categories..."
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
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data && data.data.length > 0 ? (
                  data.data.map((category: any) => (
                    <TableRow key={category.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-slate-600">{category.date}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-600 hover:bg-amber-50"
                          onClick={() => handleOpenEdit(category)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(category)}
                          disabled={deleteCategory.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-slate-500 py-8">
                      No categories found
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'Update Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
              <Input
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Color (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Parent ID</label>
              <Input
                value={formData.parent}
                onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                placeholder="Parent ID (optional)"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              No
            </Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleSubmit}
              disabled={saveCategory.isPending}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCategory?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedCategory && deleteCategory.mutate(selectedCategory.id)}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
