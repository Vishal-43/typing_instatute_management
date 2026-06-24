import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Pencil, CheckCircle, XCircle } from 'lucide-react';
import { useGetStudentQuery, useApproveStudentMutation } from '../services/studentsApi';
import { useCreateEnrollmentMutation } from '../services/enrollmentsApi';
import { useGetCoursesQuery } from '../services/coursesApi';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import dayjs from 'dayjs';

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetStudentQuery(id);
  const { data: coursesData } = useGetCoursesQuery();
  const [createEnrollment] = useCreateEnrollmentMutation();
  const [approveStudent] = useApproveStudentMutation();
  const [showEnroll, setShowEnroll] = useState(false);
  const [tab, setTab] = useState('enrollments');
  const [enrollCourse, setEnrollCourse] = useState('');
  const [enrollStart, setEnrollStart] = useState('');
  const [enrollEnd, setEnrollEnd] = useState('');
  const [enrollFee, setEnrollFee] = useState('');

  const student = data?.data?.student;
  const enrollments = data?.data?.enrollments || [];
  const feeReceipts = data?.data?.feeReceipts || [];

  const courses = coursesData?.data || [];

  const updateEnrollEnd = (courseId, sDate) => {
    if (!courseId || !sDate) { setEnrollEnd(''); return; }
    const course = courses.find(c => c._id === courseId);
    if (!course) return;
    setEnrollEnd(dayjs(sDate).add(Number(course.duration), 'month').format('YYYY-MM-DD'));
  };

  const handleCourseChange = (e) => {
    const val = e.target.value;
    setEnrollCourse(val);
    const course = courses.find(c => c._id === val);
    setEnrollFee(course ? String(course.feesAmount) : '');
    updateEnrollEnd(val, enrollStart);
  };

  const handleStartChange = (e) => {
    const val = e.target.value;
    setEnrollStart(val);
    updateEnrollEnd(enrollCourse, val);
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await createEnrollment({
        student: id,
        course: fd.get('course'),
        startDate: fd.get('startDate'),
        endDate: enrollEnd,
        courseFee: Number(enrollFee),
      }).unwrap();
      setShowEnroll(false);
      setEnrollCourse('');
      setEnrollStart('');
      setEnrollEnd('');
      setEnrollFee('');
    } catch (err) {
      alert(err.data?.message || 'Enrollment failed');
    }
  };

  const handleApprove = async () => {
    try {
      await approveStudent({ id, isApproved: !student.isApproved }).unwrap();
    } catch (err) {
      alert(err.data?.message || 'Failed to update approval status');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-text-secondary">Loading...</div>;
  if (!student) return <div className="p-8 text-center text-text-secondary">Student not found</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/students')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-text-primary">{student.firstName} {student.surname}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant={student.isApproved ? 'outline' : 'default'}
            onClick={handleApprove}
          >
            {student.isApproved ? <XCircle size={16} className="mr-1" /> : <CheckCircle size={16} className="mr-1" />}
            {student.isApproved ? 'Disapprove' : 'Approve'}
          </Button>
          <Button variant="outline" onClick={() => setShowEnroll(true)}>Enroll in Course</Button>
          <Button variant="outline" onClick={() => navigate(`/students/${id}/edit`)}>
            <Pencil size={16} className="mr-1" /> Edit
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-primary">
              {student.firstName?.[0]}{student.surname?.[0]}
            </div>
            <h3 className="font-semibold">{student.firstName} {student.surname}</h3>
            <p className="text-sm text-text-secondary">{student.grNo}</p>
            <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${student.isApproved ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
              {student.isApproved ? 'Approved' : 'Pending'}
            </span>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-text-secondary">Mobile:</span> {student.mobile}</div>
              <div><span className="text-text-secondary">Email:</span> {student.email || '-'}</div>
              <div><span className="text-text-secondary">GR No:</span> {student.grNo}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            {['enrollments', 'fees'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t ? 'bg-primary text-white' : 'text-text-secondary hover:bg-gray-100'}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {tab === 'enrollments' && (
            <DataTable
              columns={[
                { key: 'course', label: 'Course', render: (r) => r.course?.name || '-' },
                { key: 'startDate', label: 'Start Date', render: (r) => new Date(r.startDate).toLocaleDateString('en-IN') },
                { key: 'endDate', label: 'End Date', render: (r) => new Date(r.endDate).toLocaleDateString('en-IN') },
                { key: 'courseFee', label: 'Fee', render: (r) => `₹${r.courseFee}` },
              ]}
              data={enrollments}
              loading={false}
            />
          )}
          {tab === 'fees' && (
            <DataTable
              columns={[
                { key: 'receiptNumber', label: 'Receipt No' },
                { key: 'course', label: 'Course', render: (r) => r.course?.name || '-' },
                { key: 'amountPaid', label: 'Amount', render: (r) => `₹${r.amountPaid}` },
                { key: 'paymentDate', label: 'Date', render: (r) => new Date(r.paymentDate).toLocaleDateString('en-IN') },
                { key: 'paymentMode', label: 'Mode' },
              ]}
              data={feeReceipts}
              loading={false}
            />
          )}
        </CardContent>
      </Card>
      <Modal isOpen={showEnroll} onClose={() => setShowEnroll(false)} title="Enroll in Course">
        <form onSubmit={handleEnroll} className="space-y-4">
          <Select label="Course" name="course" value={enrollCourse} onChange={handleCourseChange} required options={courses.map(c => ({ value: c._id, label: `${c.name} (${c.language}) - ₹${c.feesAmount}` }))} />
          <Input label="Start Date" name="startDate" type="date" value={enrollStart} onChange={handleStartChange} required />
          <Input label="End Date" type="date" value={enrollEnd} disabled />
          <Input label="Course Fee" name="courseFee" type="number" value={enrollFee} onChange={(e) => setEnrollFee(e.target.value)} required />
          <Button type="submit" className="w-full">Enroll</Button>
        </form>
      </Modal>
    </div>
  );
}
