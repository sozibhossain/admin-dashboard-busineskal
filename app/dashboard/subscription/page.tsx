'use client'

import { useState } from 'react'
import { Edit, Plus, Trash2 } from 'lucide-react'
import {
  useSubscriptionsQuery,
  useDeleteSubscriptionMutation,
  useSubscriptionMutation,
} from '@/lib/hooks/queries'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SubscriptionPage() {
  const { data, isLoading } = useSubscriptionsQuery()
  const deleteSubscription = useDeleteSubscriptionMutation()
  const saveSubscription = useSubscriptionMutation()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [formData, setFormData] = useState({
    planName: '',
    pricePerMonth: '',
    pricePerYear: '',
    features: '',
  })

  const handleOpenCreate = () => {
    setSelectedPlan(null)
    setFormData({
      planName: '',
      pricePerMonth: '',
      pricePerYear: '',
      features: '',
    })
    setIsFormOpen(true)
  }

  const handleOpenEdit = (plan: any) => {
    setSelectedPlan(plan)
    setFormData({
      planName: plan.name || '',
      pricePerMonth: plan.pricePerMonth ?? '',
      pricePerYear: plan.pricePerYear ?? '',
      features: Array.isArray(plan.features) ? plan.features.join(', ') : plan.features || '',
    })
    setIsFormOpen(true)
  }

  const handleSubmit = () => {
    const payload = {
      planName: formData.planName,
      pricePerMonth: Number(formData.pricePerMonth || 0),
      pricePerYear: Number(formData.pricePerYear || 0),
      features: formData.features
        ? formData.features.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
    }
    saveSubscription.mutate(
      { id: selectedPlan?.id, payload },
      {
        onSuccess: () => setIsFormOpen(false),
      }
    )
  }

  const handleDelete = (plan: any) => {
    setSelectedPlan(plan)
    setIsDeleteOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Subscription Plans</h1>
          <p className="text-sm text-slate-600 mt-1">Dashboard â€º Subscription</p>
        </div>
        <Button
          className="bg-amber-600 hover:bg-amber-700 text-white"
          onClick={handleOpenCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
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
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        onClick={() => handleOpenEdit(sub)}
                      >
                        <Edit className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        onClick={() => handleDelete(sub)}
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPlan ? 'Update Plan' : 'Add Plan'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Plan Name
              </label>
              <Input
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price Per Month
              </label>
              <Input
                value={formData.pricePerMonth}
                onChange={(e) => setFormData({ ...formData, pricePerMonth: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price Per Year
              </label>
              <Input
                value={formData.pricePerYear}
                onChange={(e) => setFormData({ ...formData, pricePerYear: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Features (comma separated)
              </label>
              <Input
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
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
              disabled={saveSubscription.isPending}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPlan?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedPlan && deleteSubscription.mutate(selectedPlan.id)}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
