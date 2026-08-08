import React, { useState, useEffect } from 'react';
import { useUI } from '@/components/UIProvider';

export default function PromotionsAdmin() {
  const { showAlert, showConfirm } = useUI();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    promotion_type: 'top_ad',
    duration_days: 7,
    price: 9.99,
    is_active: true
  });

  const fetchPromotions = async () => {
    try {
      const res = await fetch('/api/admin/promotions');
      const data = await res.json();
      if (data.success) {
        setPromotions(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = isEditing ? { ...formData, id: isEditing } : formData;
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showAlert(isEditing ? 'Promotion package updated successfully!' : 'New promotion package added!', 'success');
        fetchPromotions();
        setIsEditing(null);
        setFormData({ promotion_type: 'top_ad', duration_days: 7, price: 9.99, is_active: true });
      } else {
        showAlert(data.message || 'Failed to save promotion pricing', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Error saving promotion pricing', 'error');
    }
  };

  const handleEdit = (promo: any) => {
    setIsEditing(promo.id);
    setFormData({
      promotion_type: promo.promotion_type,
      duration_days: promo.duration_days,
      price: Number(promo.price),
      is_active: promo.is_active
    });
  };

  const handleDelete = async (id: number) => {
    showConfirm({
      title: 'Delete Package',
      message: 'Are you sure you want to delete this promotion package? This cannot be undone.',
      isDestructive: true,
      confirmText: 'Delete Package',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/promotions?id=${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (res.ok && data.success) {
            showAlert('Promotion package deleted successfully.', 'success');
            fetchPromotions();
          } else {
            showAlert(data.message || 'Failed to delete package.', 'error');
          }
        } catch (err) {
          console.error(err);
          showAlert('Error deleting promotion package.', 'error');
        }
      }
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-900">Promotions Pricing Management</h2>
          <p className="text-sm text-slate-500 mt-1">Configure duration and pricing options for each promotion type.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSave} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{isEditing ? 'Edit Package' : 'Add New Package'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Promotion Type</label>
                <select 
                  value={formData.promotion_type}
                  onChange={e => setFormData({...formData, promotion_type: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="top_ad">Top Ad</option>
                  <option value="highlighted">Highlighted</option>
                  <option value="urgent">Urgent</option>
                  <option value="home_gallery">Home Gallery</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Duration (Days)</label>
                <input 
                  type="number" 
                  min="1"
                  value={formData.duration_days}
                  onChange={e => setFormData({...formData, duration_days: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active}
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded border-slate-300"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Active</label>
              </div>

              <div className="pt-4 flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                  {isEditing ? 'Update Package' : 'Add Package'}
                </button>
                {isEditing && (
                  <button type="button" onClick={() => { setIsEditing(null); setFormData({ promotion_type: 'top_ad', duration_days: 7, price: 9.99, is_active: true }); }} className="bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-black text-slate-900 text-sm">Type</th>
                  <th className="p-4 font-black text-slate-900 text-sm">Duration</th>
                  <th className="p-4 font-black text-slate-900 text-sm">Price</th>
                  <th className="p-4 font-black text-slate-900 text-sm">Status</th>
                  <th className="p-4 font-black text-slate-900 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promotions.map((promo: any) => (
                  <tr key={promo.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-bold text-slate-800 capitalize">
                      {promo.promotion_type.replace('_', ' ')}
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium">
                      {promo.duration_days} Days
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium">
                      ${Number(promo.price).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold ${promo.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {promo.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(promo)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors mr-1">
                        <span className="material-icons text-sm">edit</span>
                      </button>
                      <button onClick={() => handleDelete(promo.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {promotions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                      No promotion packages configured yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
