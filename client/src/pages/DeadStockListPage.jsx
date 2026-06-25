import { useState } from 'react';
import { Plus, Download, FileSpreadsheet, Image } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetDeadStockQuery, useCreateDeadStockMutation, useUpdateDeadStockMutation } from '../services/deadstockApi';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { DataTable } from '../components/ui/DataTable';

const apiBase = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/api\/v1\/?$/, '');

const categories = ['Computer', 'CPU', 'Monitor', 'Keyboard', 'Mouse', 'Camera', 'Printer', 'UPS', 'Other'];
const reasons = ['Damaged', 'Not Working', 'Obsolete', 'Broken', 'Scrap'];

export default function DeadStockListPage() {
  const token = useSelector((state) => state.auth.token);
  const { data, isLoading } = useGetDeadStockQuery();
  const [createDeadStock] = useCreateDeadStockMutation();
  const [updateDeadStock] = useUpdateDeadStockMutation();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      if (editItem) {
        await updateDeadStock({ id: editItem._id, formData: fd }).unwrap();
      } else {
        await createDeadStock(fd).unwrap();
      }
      setShowModal(false);
      setEditItem(null);
    } catch (err) {
      alert(err.data?.message || 'Failed to save');
    }
  };

  const exportReport = (period, format) => {
    window.open(`/api/v1/deadstock/report/${period}?format=${format}&token=${token}`, '_blank');
  };

  const resolveUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return `${apiBase}${url}`;
    return url;
  };

  const columns = [
    {
      key: 'imageUrl', label: 'Image', render: (r) => r.imageUrl ? (
        <a href={resolveUrl(r.imageUrl)} target="_blank" rel="noopener noreferrer">
          <Image size={20} className="text-primary hover:text-primary-dark" />
        </a>
      ) : '-',
    },
    { key: 'assetName', label: 'Asset Name' },
    { key: 'assetCode', label: 'Code' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Qty' },
    { key: 'reason', label: 'Reason' },
    { key: 'deadStockDate', label: 'Date', render: (r) => new Date(r.deadStockDate).toLocaleDateString('en-IN') },
    { key: 'status', label: 'Status', render: (r) => <span className={`px-2 py-1 text-xs font-medium rounded-full ${r.status === 'Active' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-text-secondary'}`}>{r.status}</span> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Dead Stock</h1>
        <div className="flex gap-2">
          <div className="relative group">
            <Button variant="outline"><Download size={16} className="mr-1" /> Export Report</Button>
            <div className="absolute right-0 sm:left-0 mt-1 bg-white border border-border rounded-lg shadow-lg hidden group-hover:block z-10 min-w-[180px] whitespace-nowrap">
              <button onClick={() => exportReport('monthly', 'pdf')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Monthly PDF</button>
              <button onClick={() => exportReport('monthly', 'excel')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Monthly Excel</button>
              <button onClick={() => exportReport('yearly', 'pdf')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Yearly PDF</button>
              <button onClick={() => exportReport('yearly', 'excel')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Yearly Excel</button>
            </div>
          </div>
          <Button onClick={() => { setEditItem(null); setShowModal(true); }}><Plus size={18} className="mr-1" /> Add Entry</Button>
        </div>
      </div>
      <DataTable columns={columns} data={data?.data || []} loading={isLoading} emptyMessage="No dead stock entries" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditItem(null); }} title={editItem ? 'Edit Entry' : 'Add Dead Stock Entry'}>
        <form onSubmit={handleSubmit} className="space-y-4" key={editItem?._id}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Asset Name" name="assetName" defaultValue={editItem?.assetName || ''} required />
            <Input label="Asset Code" name="assetCode" defaultValue={editItem?.assetCode || ''} required />
            <Select label="Category" name="category" defaultValue={editItem?.category || ''} required options={categories.map(c => ({ value: c, label: c }))} />
            <Input label="Quantity" name="quantity" type="number" defaultValue={editItem?.quantity || 1} required />
            <Input label="Purchase Date" name="purchaseDate" type="date" defaultValue={editItem?.purchaseDate?.split('T')[0] || ''} />
            <Input label="Dead Stock Date" name="deadStockDate" type="date" defaultValue={editItem?.deadStockDate?.split('T')[0] || ''} required />
            <Select label="Reason" name="reason" defaultValue={editItem?.reason || ''} required options={reasons.map(r => ({ value: r, label: r }))} />
            <Select label="Status" name="status" defaultValue={editItem?.status || 'Active'} options={[{ value: 'Active', label: 'Active' }, { value: 'Disposed', label: 'Disposed' }]} />
          </div>
          <Input label="Remarks" name="remarks" defaultValue={editItem?.remarks || ''} />
          <Input label="Image" name="image" type="file" accept="image/*" />
          <Button type="submit" className="w-full">{editItem ? 'Update' : 'Create'} Entry</Button>
        </form>
      </Modal>
    </div>
  );
}
