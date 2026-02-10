'use client'

import { useState } from 'react'
import { Upload, Trash2, Edit } from 'lucide-react'
import {
  useBannerAdsQuery,
  useUploadBannerMutation,
  useDeleteBannerMutation,
} from '@/lib/hooks/queries'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function BannerAdsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [editFile, setEditFile] = useState<File | null>(null)
  const [editBanner, setEditBanner] = useState<any>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const { data, isLoading } = useBannerAdsQuery({ page: 1, limit: 50 })
  const uploadBanner = useUploadBannerMutation()
  const deleteBanner = useDeleteBannerMutation()

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    uploadBanner.mutate(formData, {
      onSuccess: () => setFile(null),
    })
  }

  const handleOpenEdit = (banner: any) => {
    setEditBanner(banner)
    setEditFile(null)
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    if (!editFile || !editBanner) return
    const formData = new FormData()
    formData.append('image', editFile)
    uploadBanner.mutate(formData, {
      onSuccess: () => {
        deleteBanner.mutate(editBanner.id)
        setIsEditOpen(false)
        setEditBanner(null)
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Banner Ads</h1>
        <p className="text-sm text-slate-600 mt-1">Dashboard â€º Ads</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 flex flex-col items-center justify-center min-h-80">
          <Upload className="w-12 h-12 text-slate-400 mb-4" />
          <p className="text-slate-500 font-medium">Upload your banner</p>
          <input
            type="file"
            accept="image/*"
            className="mt-4"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition-colors disabled:opacity-60"
            onClick={handleUpload}
            disabled={!file || uploadBanner.isPending}
          >
            {uploadBanner.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Uploaded Banners</h2>
        {isLoading ? (
          <p className="text-slate-500">Loading...</p>
        ) : data?.data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((banner: any) => (
              <div key={banner.id} className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-slate-50">
                  {banner.image ? (
                    <img src={banner.image} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-xs text-slate-500">
                    {banner.date ? new Date(banner.date).toLocaleDateString() : ''}
                  </span>
                  <button
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                    onClick={() => handleOpenEdit(banner)}
                  >
                    <Edit className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    onClick={() => deleteBanner.mutate(banner.id)}
                    disabled={deleteBanner.isPending}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No banners found</p>
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditFile(e.target.files?.[0] || null)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              No
            </Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleUpdate}
              disabled={!editFile || uploadBanner.isPending}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
