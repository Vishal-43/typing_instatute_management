import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Trash2, Eye } from 'lucide-react';
import { useGetResultsQuery, useCreateResultMutation, useDeleteResultMutation } from '../services/resultsApi';
import { useGetCoursesQuery } from '../services/coursesApi';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { DataTable } from '../components/ui/DataTable';

export default function ResultListPage() {
  const token = useSelector((state) => state.auth.token);
  const [filters, setFilters] = useState({ year: '', examSession: '', subject: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const { data, isLoading } = useGetResultsQuery(filters);
  const { data: coursesData } = useGetCoursesQuery();
  const [createResult] = useCreateResultMutation();
  const [deleteResult] = useDeleteResultMutation();

  const courses = coursesData?.data || [];

  const handleUpload = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const course = courses.find(c => c._id === fd.get('course'));
    if (course) fd.set('subject', course.language);
    fd.delete('course');
    try {
      await createResult(fd).unwrap();
      setShowModal(false);
      setSelectedCourse('');
    } catch (err) {
      alert(err.data?.message || 'Upload failed');
    }
  };

  const columns = [
    { key: 'year', label: 'Year' },
    { key: 'examSession', label: 'Session' },
    { key: 'subject', label: 'Subject' },
    { key: 'remarks', label: 'Remarks' },
    { key: 'createdAt', label: 'Uploaded', render: (r) => new Date(r.createdAt).toLocaleDateString('en-IN') },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => window.open(`/api/v1/results/${r._id}/view?token=${token}`, '_blank')}><Eye size={16} /></Button>
          <Button variant="ghost" size="sm" onClick={() => deleteResult(r._id)}><Trash2 size={16} className="text-red-500" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Results</h1>
        <Button onClick={() => setShowModal(true)}><Plus size={18} className="mr-1" /> Upload Result</Button>
      </div>
      <div className="flex gap-4 mb-6">
        <Input placeholder="Year" value={filters.year} onChange={(e) => setFilters(f => ({ ...f, year: e.target.value }))} />
        <Select options={[{ value: 'June', label: 'June' }, { value: 'December', label: 'December' }]} placeholder="Session" value={filters.examSession} onChange={(e) => setFilters(f => ({ ...f, examSession: e.target.value }))} />
        <Select options={courses.map(c => ({ value: c.language, label: `${c.name} (${c.language})` }))} placeholder="Course" value={filters.subject} onChange={(e) => setFilters(f => ({ ...f, subject: e.target.value }))} />
      </div>
      <DataTable columns={columns} data={data?.data || []} loading={isLoading} emptyMessage="No results uploaded" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setSelectedCourse(''); }} title="Upload Result">
        <form onSubmit={handleUpload} className="space-y-4">
          <Select label="Exam Session" name="examSession" required options={[{ value: 'June', label: 'June' }, { value: 'December', label: 'December' }]} />
          <Input label="Year" name="year" type="number" required />
          <Select label="Course" name="course" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required options={courses.map(c => ({ value: c._id, label: `${c.name} (${c.language})` }))} />
          <Input label="PDF File" name="file" type="file" accept=".pdf" required />
          <Input label="Remarks" name="remarks" />
          <Button type="submit" className="w-full">Upload</Button>
        </form>
      </Modal>
    </div>
  );
}
