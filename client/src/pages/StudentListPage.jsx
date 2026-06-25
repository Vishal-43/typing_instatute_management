import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil } from 'lucide-react';
import { useGetStudentsQuery } from '../services/studentsApi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { DataTable } from '../components/ui/DataTable';

export default function StudentListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const navigate = useNavigate();

  const { data, isLoading } = useGetStudentsQuery({ page, limit: 10, search, subject });

  const columns = [
    { key: 'grNo', label: 'GR No' },
    { key: 'firstName', label: 'Name', render: (r) => `${r.firstName} ${r.surname}` },
    { key: 'mobile', label: 'Mobile' },
    { key: 'subject', label: 'Subject' },
    { key: 'examSession', label: 'Session' },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${r._id}`)}>
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${r._id}/edit`)}>
            <Pencil size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Students</h1>
        <Link to="/students/new">
          <Button><Plus size={18} className="mr-1" /> Add Student</Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <Input placeholder="Search by name, GR No, or mobile..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="w-48">
          <Select options={[
            { value: 'English', label: 'English' },
            { value: 'Marathi', label: 'Marathi' },
            { value: 'Hindi', label: 'Hindi' },
          ]} placeholder="All Subjects" value={subject} onChange={(e) => { setSubject(e.target.value); setPage(1); }} />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data?.data?.students || []}
        loading={isLoading}
        page={data?.data?.page || 1}
        pages={data?.data?.pages || 1}
        onPageChange={setPage}
        emptyMessage="No students found. Add your first student!"
      />
    </div>
  );
}
