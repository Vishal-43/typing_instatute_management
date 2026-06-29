import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card, CardHeader, CardContent } from '../components/ui/Card';

const apiBase = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/api\/v1\/?$/, '');

export default function StudentRegistrationPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    axios.get(`${apiBase}/api/v1/courses`)
      .then(res => setCourses((res.data?.data || []).filter(c => c.isActive)))
      .catch(() => {});
  }, []);

  const updateEndDate = (courseId, sDate) => {
    if (!courseId || !sDate) { setEndDate(''); return; }
    const course = courses.find(c => c._id === courseId);
    if (!course) return;
    setEndDate(dayjs(sDate).add(Number(course.duration), 'month').format('YYYY-MM-DD'));
  };

  const handleCourseChange = (e) => {
    const val = e.target.value;
    setSelectedCourse(val);
    updateEndDate(val, startDate);
  };

  const handleStartDateChange = (e) => {
    const val = e.target.value;
    setStartDate(val);
    updateEndDate(selectedCourse, val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);

    try {
      await axios.post(`${apiBase}/api/v1/students/register`, data);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <Card className="w-full max-w-lg text-center p-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Registration Submitted!</h1>
          <p className="text-text-secondary mb-6">Your admission request has been received. Please contact the institute for further processing.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">TIMS</h1>
          <p className="text-text-secondary mt-1">Student Admission Form</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader><h2 className="font-semibold">Personal Information</h2></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Surname *" name="surname" required />
                <Input label="First Name *" name="firstName" required />
                <Input label="Father's/Husband's Name" name="fathersName" />
                <Input label="Mother's Name" name="mothersName" />
                <Input label="Mobile *" name="mobile" pattern="[0-9]{10}" title="Enter 10-digit mobile number" required />
                <Input label="Telephone" name="telephone" />
                <Input label="Email" type="email" name="email" pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" title="Enter a valid email address" />
                <Input label="Date of Birth" type="date" name="dateOfBirth" />
                <Select label="Language *" name="subject" required options={[
                  { value: 'English', label: 'English' }, { value: 'Marathi', label: 'Marathi' }, { value: 'Hindi', label: 'Hindi' },
                ]} />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader><h2 className="font-semibold">Address & Education</h2></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Permanent Address" name="permanentAddress" />
                <Input label="Residential Address" name="residentialAddress" />
                <Input label="School/College Name" name="schoolCollegeName" />
                <Input label="Qualification" name="qualification" />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader><h2 className="font-semibold">Admission</h2></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Select Course *" name="course" value={selectedCourse} onChange={handleCourseChange} required options={courses.map(c => ({
                  value: c._id,
                  label: `${c.name} (${c.language}) - ${c.duration} months - ₹${c.feesAmount}`,
                }))} />
                <Input label="Date of Admission *" type="date" name="dateOfAdmission" required />
                <Input label="Start Date *" type="date" name="startDate" value={startDate} onChange={handleStartDateChange} required />
                <Input label="End Date" type="date" name="endDate" value={endDate} readOnly />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Registration'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
