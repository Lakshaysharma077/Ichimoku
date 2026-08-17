'use client';

import { useState } from 'react';
import { useAdminStore, Indicator } from '@/store/adminStore';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Plus, Save, X } from 'lucide-react';

export default function AdminPanel() {
  const { indicators, addIndicator, updateIndicator } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);

  const [formData, setFormData] = useState<Partial<Indicator>>({
    name: '',
    description: '',
    badgeType: 'FREE',
    price: '',
    tvUrl: '',
    category: [],
    status: 'Draft',
    sortOrder: indicators.length + 1,
    rating: 5,
    numRatings: 0,
  });

  const handleOpenAdd = () => {
    setEditingIndicator(null);
    setFormData({
      name: '',
      description: '',
      badgeType: 'FREE',
      price: '',
      tvUrl: '',
      category: [],
      status: 'Draft',
      sortOrder: indicators.length + 1,
      rating: 5,
      numRatings: 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;

    if (editingIndicator) {
      updateIndicator(editingIndicator.id, formData);
    } else {
      addIndicator({
        ...formData as Indicator,
        id: Math.random().toString(36).substr(2, 9),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="mb-12 flex items-center justify-between p-4 bg-bg-secondary border border-border rounded-xl">
      <div className="flex gap-2">
        <Button size="sm" onClick={handleOpenAdd} className="flex gap-2">
          <Plus className="w-4 h-4" /> Add New Indicator
        </Button>
        <Button size="sm" variant="outline">Sort</Button>
        <Button size="sm" variant="outline">Bulk Edit</Button>
      </div>
      <div className="text-xs font-mono text-text-muted uppercase tracking-widest">
        Admin Mode Active · {indicators.length} Indicators
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndicator ? "Edit Indicator" : "Add New Indicator"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-bg-tertiary border border-border rounded p-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Price</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-bg-tertiary border border-border rounded p-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-bg-tertiary border border-border rounded p-3 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Badge Type</label>
              <select
                value={formData.badgeType}
                onChange={(e) => setFormData({ ...formData, badgeType: e.target.value as any })}
                className="bg-bg-tertiary border border-border rounded p-3 text-sm focus:outline-none focus:border-accent"
              >
                <option value="FREE">FREE</option>
                <option value="PREMIUM">PREMIUM</option>
                <option value="7-DAY TRIAL">7-DAY TRIAL</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="bg-bg-tertiary border border-border rounded p-3 text-sm focus:outline-none focus:border-accent"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex gap-2">
              <Save className="w-4 h-4" /> Save Indicator
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
