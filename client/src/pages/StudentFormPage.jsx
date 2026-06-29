import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCreateStudentMutation, useUpdateStudentMutation, useGetStudentQuery } from '../services/studentsApi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function StudentFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: studentData } = useGetStudentQuery(id, { skip: !isEdit });
  const [createStudent] = useCreateStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  useEffect(() => {
    if (studentData?.data?.student) {
      const s = studentData.data.student;
      reset({
        grNo: s.grNo, instituteCode: s.instituteCode, examSession: s.examSession,
        surname: s.surname, firstName: s.firstName, fathersName: s.fathersName || '',
        mothersName: s.mothersName || '', mobile: s.mobile, telephone: s.telephone || '',
        email: s.email || '', permanentAddress: s.permanentAddress || '',
        residentialAddress: s.residentialAddress || '', schoolCollegeName: s.schoolCollegeName || '',
        qualification: s.qualification || '', subject: s.subject,
        dateOfBirth: s.dateOfBirth?.split('T')[0] || '',
        dateOfAdmission: s.dateOfAdmission?.split('T')[0] || '',
      });
    }
  }, [studentData, reset]);

  const onSubmit = async (formData) => {
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) fd.append(key, value);
      });
      if (isEdit) {
        await updateStudent({ id, formData: fd }).unwrap();
      } else {
        await createStudent(fd).unwrap();
      }
      navigate('/students');
    } catch (err) {
      alert(err.data?.message || 'Failed to save student');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/students')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-text-primary">{isEdit ? 'Edit Student' : 'Add Student'}</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardHeader><h2 className="font-semibold">Institute Details</h2></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="GR No / C.T. Code *" {...register('grNo', { required: 'Required' })} error={errors.grNo?.message} />
              <Input label="Institute Code *" {...register('instituteCode', { required: 'Required' })} error={errors.instituteCode?.message} />
              <Select label="Exam Session *" options={[{ value: 'June', label: 'June' }, { value: 'December', label: 'December' }]} {...register('examSession', { required: 'Required' })} error={errors.examSession?.message} />
              <Input label="Date of Admission *" type="date" {...register('dateOfAdmission', { required: 'Required' })} error={errors.dateOfAdmission?.message} />
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardHeader><h2 className="font-semibold">Personal Information</h2></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Surname *" {...register('surname', { required: 'Required' })} error={errors.surname?.message} />
              <Input label="First Name *" {...register('firstName', { required: 'Required' })} error={errors.firstName?.message} />
              <Input label="Father's/Husband's Name" {...register('fathersName')} />
              <Input label="Mother's Name" {...register('mothersName')} />
              <Input label="Mobile *" {...register('mobile', { required: 'Required' })} error={errors.mobile?.message} />
              <Input label="Telephone" {...register('telephone')} />
              <Input label="Email" type="email" {...register('email')} />
              <Input label="Date of Birth" type="date" {...register('dateOfBirth')} />
              <Select label="Lanuage *" options={[{ value: 'English', label: 'English' }, { value: 'Marathi', label: 'Marathi' }, { value: 'Hindi', label: 'Hindi' }]} {...register('subject', { required: 'Required' })} error={errors.subject?.message} />
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardHeader><h2 className="font-semibold">Address & Education</h2></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Permanent Address" {...register('permanentAddress')} />
              <Input label="Residential Address" {...register('residentialAddress')} />
              <Input label="School/College Name" {...register('schoolCollegeName')} />
              <Input label="Qualification" {...register('qualification')} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/students')}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (isEdit ? 'Update Student' : 'Create Student')}</Button>
        </div>
      </form>
    </div>
  );
}
