import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Download, Pencil } from 'lucide-react';
import { useGetFeesQuery, useCreateFeeMutation, useUpdateFeeMutation } from '../services/feesApi';
import { useGetStudentsQuery } from '../services/studentsApi';
import { useGetCoursesQuery } from '../services/coursesApi';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { DataTable } from '../components/ui/DataTable';

export default function FeeListPage() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const { data, isLoading } = useGetFeesQuery({ page, limit: 10 });
  const { data: studentsData } = useGetStudentsQuery({ limit: 1000, isApproved: 'true' });
  const { data: coursesData } = useGetCoursesQuery();
  const [createFee] = useCreateFeeMutation();
  const [updateFee] = useUpdateFeeMutation();

  const fees = data?.data?.fees || [];
  const students = studentsData?.data?.students || [];
  const courses = coursesData?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    try {
      if (editId) {
        await updateFee({ id: editId, ...data }).unwrap();
      } else {
        await createFee(data).unwrap();
      }
      setShowModal(false);
      setEditId(null);
    } catch (err) {
      alert(err.data?.message || 'Failed to save receipt');
    }
  };

  const downloadPDF = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/v1/fees/${id}/pdf`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `receipt-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download PDF');
    }
  }, [token]);

  const columns = [
    { key: 'receiptNumber', label: 'Receipt No' },
    { key: 'student', label: 'Student', render: (r) => r.student ? `${r.student.firstName} ${r.student.surname}` : '-' },
    { key: 'course', label: 'Course', render: (r) => r.course?.name || '-' },
    { key: 'amountPaid', label: 'Amount', render: (r) => `₹${r.amountPaid}` },
    { key: 'paymentDate', label: 'Date', render: (r) => new Date(r.paymentDate).toLocaleDateString('en-IN') },
    { key: 'paymentMode', label: 'Mode' },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => downloadPDF(r._id)}><Download size={16} /></Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Fee Receipts</h1>
        <Button onClick={() => { setEditId(null); setShowModal(true); }}>
          <Plus size={18} className="mr-1" /> New Receipt
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={fees}
        loading={isLoading}
        page={data?.data?.page || 1}
        pages={data?.data?.pages || 1}
        onPageChange={setPage}
        emptyMessage="No receipts yet"
      />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditId(null); }} title="New Fee Receipt">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Student" name="student" required options={students.map(s => ({ value: s._id, label: `${s.firstName} ${s.surname} (${s.grNo})` }))} />
          <Select label="Course" name="course" required options={courses.map(c => ({ value: c._id, label: `${c.name} - ₹${c.feesAmount}` }))} />
          <Input label="Start Date" name="startDate" type="date" required />
          <Input label="End Date" name="endDate" type="date" required />
          <Input label="Amount Paid" name="amountPaid" type="number" required />
          <Input label="Payment Date" name="paymentDate" type="date" required />
          <Select label="Payment Mode" name="paymentMode" required options={[
            { value: 'Cash', label: 'Cash' }, { value: 'UPI', label: 'UPI' }, { value: 'Bank Transfer', label: 'Bank Transfer' },
          ]} />
          <Input label="Remarks" name="remarks" />
          <Button type="submit" className="w-full">Save & Generate Receipt</Button>
        </form>
      </Modal>
    </div>
  );
}
