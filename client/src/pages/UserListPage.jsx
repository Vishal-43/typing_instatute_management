import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../services/usersApi';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { DataTable } from '../components/ui/DataTable';

export default function UserListPage() {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const { data, isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    try {
      if (editItem) {
        await updateUser({ id: editItem._id, ...data }).unwrap();
      } else {
        await createUser(data).unwrap();
      }
      setShowModal(false);
      setEditItem(null);
    } catch (err) {
      alert(err.data?.message || 'Failed to save admin');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this admin?')) return;
    try {
      await deleteUser(id).unwrap();
    } catch (err) {
      alert(err.data?.message || 'Failed to delete');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'isActive', label: 'Status', render: (r) => r.isActive ? 'Active' : 'Inactive' },
    { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString('en-IN') },
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
        <h1 className="text-2xl font-bold text-text-primary">Admins</h1>
        <Button onClick={() => { setEditItem(null); setShowModal(true); }}>
          <Plus size={18} className="mr-1" /> Add Admin
        </Button>
      </div>
      <DataTable columns={columns} data={data?.data || []} loading={isLoading} emptyMessage="No admins" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditItem(null); }} title={editItem ? 'Edit Admin' : 'Add Admin'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" name="name" defaultValue={editItem?.name || ''} required />
          <Input label="Email" name="email" type="email" defaultValue={editItem?.email || ''} required={!editItem} />
          <Input label="Password" name="password" type="password" placeholder={editItem ? 'Leave blank to keep current' : ''} required={!editItem} />
          <Button type="submit" className="w-full">{editItem ? 'Update' : 'Add'} Admin</Button>
        </form>
      </Modal>
    </div>
  );
}
