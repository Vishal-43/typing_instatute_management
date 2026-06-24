import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetExpensesQuery, useCreateExpenseMutation, useUpdateExpenseMutation, useDeleteExpenseMutation } from '../services/expensesApi';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { DataTable } from '../components/ui/DataTable';

const categories = [
  { value: 'Rent', label: 'Rent' },
  { value: 'Electricity', label: 'Electricity' },
  { value: 'Internet', label: 'Internet' },
  { value: 'Stationery', label: 'Stationery' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Salary', label: 'Salary' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Other', label: 'Other' },
];

const paymentModes = [
  { value: 'Cash', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
];

export default function ExpenseListPage() {
  const token = useSelector((state) => state.auth.token);
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const { data, isLoading } = useGetExpensesQuery(filterCategory ? { category: filterCategory } : {});
  const [createExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      if (editItem) {
        await updateExpense({ id: editItem._id, formData: fd }).unwrap();
      } else {
        await createExpense(fd).unwrap();
      }
      setShowModal(false);
      setEditItem(null);
    } catch (err) {
      alert(err.data?.message || 'Failed to save expense');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id).unwrap();
    } catch (err) {
      alert(err.data?.message || 'Failed to delete');
    }
  };

  const columns = [
    { key: 'expenseDate', label: 'Date', render: (r) => new Date(r.expenseDate).toLocaleDateString('en-IN') },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount}` },
    { key: 'paymentMode', label: 'Mode' },
    { key: 'description', label: 'Description' },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-2">
          {r.receiptUrl && (
            <Button variant="ghost" size="sm" onClick={async () => {
              const res = await fetch(`/api/v1/expenses/${r._id}/receipt`, {
                headers: { authorization: `Bearer ${token}` },
              });
              if (!res.ok) { alert('Failed to load receipt'); return; }
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `receipt-${r._id}.pdf`;
              a.click();
              URL.revokeObjectURL(url);
            }}><Eye size={16} /></Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => { setEditItem(r); setShowModal(true); }}><Pencil size={16} /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(r._id)}><Trash2 size={16} className="text-red-500" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Expenses</h1>
        <Button onClick={() => { setEditItem(null); setShowModal(true); }}>
          <Plus size={18} className="mr-1" /> Add Expense
        </Button>
      </div>
      <div className="flex gap-4 mb-6">
        <Select
          options={categories}
          placeholder="All Categories"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />
      </div>
      <DataTable columns={columns} data={data?.data || []} loading={isLoading} emptyMessage="No expenses logged" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditItem(null); }} title={editItem ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Category" name="category" defaultValue={editItem?.category || ''} required options={categories} />
          <Input label="Amount" name="amount" type="number" defaultValue={editItem?.amount || ''} required />
          <Input label="Description" name="description" defaultValue={editItem?.description || ''} />
          <Input label="Expense Date" name="expenseDate" type="date" defaultValue={editItem?.expenseDate?.split('T')[0] || ''} required />
          <Select label="Payment Mode" name="paymentMode" defaultValue={editItem?.paymentMode || ''} required options={paymentModes} />
          <Input label="Receipt (optional)" name="receipt" type="file" accept="image/*,.pdf" />
          {editItem?.receiptUrl && (
            <p className="text-xs text-text-secondary">Current: {editItem.receiptUrl.split('/').pop()}</p>
          )}
          <Button type="submit" className="w-full">{editItem ? 'Update' : 'Add'} Expense</Button>
        </form>
      </Modal>
    </div>
  );
}
