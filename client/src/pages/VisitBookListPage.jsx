import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useGetVisitsQuery, useCreateVisitMutation, useUpdateVisitMutation, useDeleteVisitMutation } from '../services/visitBookApi';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { DataTable } from '../components/ui/DataTable';

const purposes = [
  { value: 'Admission', label: 'Admission' },
  { value: 'Examination', label: 'Examination' },
  { value: 'Fee Payment', label: 'Fee Payment' },
  { value: 'Inquiry', label: 'Inquiry' },
  { value: 'Meeting', label: 'Meeting' },
  { value: 'Other', label: 'Other' },
];

export default function VisitBookListPage() {
  const [filterPurpose, setFilterPurpose] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const { data, isLoading } = useGetVisitsQuery(filterPurpose ? { purpose: filterPurpose } : {});
  const [createVisit] = useCreateVisitMutation();
  const [updateVisit] = useUpdateVisitMutation();
  const [deleteVisit] = useDeleteVisitMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {
      visitorName: fd.get('visitorName'),
      phone: fd.get('phone'),
      purpose: fd.get('purpose'),
      metPerson: fd.get('metPerson'),
      checkIn: fd.get('checkIn'),
      checkOut: fd.get('checkOut') || undefined,
      vehicleNo: fd.get('vehicleNo'),
      idCardNo: fd.get('idCardNo'),
      remarks: fd.get('remarks'),
    };
    try {
      if (editItem) {
        await updateVisit({ id: editItem._id, ...body }).unwrap();
      } else {
        await createVisit(body).unwrap();
      }
      setShowModal(false);
      setEditItem(null);
    } catch (err) {
      alert(err.data?.message || 'Failed to save visit');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this visit entry?')) return;
    try {
      await deleteVisit(id).unwrap();
    } catch (err) {
      alert(err.data?.message || 'Failed to delete');
    }
  };

  const columns = [
    { key: 'visitorName', label: 'Visitor' },
    { key: 'phone', label: 'Phone' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'metPerson', label: 'Met Person' },
    { key: 'checkIn', label: 'Check In', render: (r) => new Date(r.checkIn).toLocaleString('en-IN') },
    { key: 'checkOut', label: 'Check Out', render: (r) => r.checkOut ? new Date(r.checkOut).toLocaleString('en-IN') : '-' },
    { key: 'vehicleNo', label: 'Vehicle', render: (r) => r.vehicleNo || '-' },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setEditItem(r); setShowModal(true); }}><Pencil size={16} /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(r._id)}><Trash2 size={16} className="text-red-500" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Visit Book</h1>
        <Button onClick={() => { setEditItem(null); setShowModal(true); }}>
          <Plus size={18} className="mr-1" /> Log Visit
        </Button>
      </div>
      <div className="flex gap-4 mb-6">
        <Select
          options={purposes}
          placeholder="All Purposes"
          value={filterPurpose}
          onChange={(e) => setFilterPurpose(e.target.value)}
        />
      </div>
      <DataTable columns={columns} data={data?.data || []} loading={isLoading} emptyMessage="No visits logged" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditItem(null); }} title={editItem ? 'Edit Visit' : 'Log Visit'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Visitor Name" name="visitorName" defaultValue={editItem?.visitorName || ''} required />
          <Input label="Phone" name="phone" defaultValue={editItem?.phone || ''} required />
          <Select label="Purpose" name="purpose" defaultValue={editItem?.purpose || ''} required options={purposes} />
          <Input label="Met Person" name="metPerson" defaultValue={editItem?.metPerson || ''} />
          <Input label="Check In" name="checkIn" type="datetime-local" defaultValue={editItem?.checkIn ? new Date(editItem.checkIn).toISOString().slice(0, 16) : ''} required />
          <Input label="Check Out" name="checkOut" type="datetime-local" defaultValue={editItem?.checkOut ? new Date(editItem.checkOut).toISOString().slice(0, 16) : ''} />
          <Input label="Vehicle No" name="vehicleNo" defaultValue={editItem?.vehicleNo || ''} />
          <Input label="ID Card No" name="idCardNo" defaultValue={editItem?.idCardNo || ''} />
          <Input label="Remarks" name="remarks" defaultValue={editItem?.remarks || ''} />
          <Button type="submit" className="w-full">{editItem ? 'Update' : 'Log'} Visit</Button>
        </form>
      </Modal>
    </div>
  );
}
