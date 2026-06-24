import { useState } from 'react';
import { Plus, ToggleLeft, ToggleRight, Pencil } from 'lucide-react';
import { useGetCoursesQuery, useCreateCourseMutation, useUpdateCourseMutation, useToggleCourseMutation } from '../services/coursesApi';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export default function CourseListPage() {
  const { data, isLoading } = useGetCoursesQuery();
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [toggleCourse] = useToggleCourseMutation();
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);

  const handleToggle = async (id, name) => {
    try {
      await toggleCourse(id).unwrap();
    } catch (err) {
      alert(`Failed to toggle "${name}": ${err.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    try {
      if (editCourse) {
        await updateCourse({ id: editCourse._id, ...data }).unwrap();
      } else {
        await createCourse(data).unwrap();
      }
      setShowModal(false);
      setEditCourse(null);
    } catch (err) {
      alert(err.data?.message || 'Failed to save course');
    }
  };

  const openEdit = (course) => {
    setEditCourse(course);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Courses</h1>
        <Button onClick={() => { setEditCourse(null); setShowModal(true); }}>
          <Plus size={18} className="mr-1" /> Add Course
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data?.data || []).map((course) => (
          <Card key={course._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary">{course.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">{course.language} · {course.duration} months</p>
                  <p className="text-lg font-bold text-primary mt-2">₹{course.feesAmount}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${course.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-text-secondary'}`}>
                  {course.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {course.description && <p className="text-sm text-text-secondary mt-3">{course.description}</p>}
              <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                <Button variant="ghost" size="sm" onClick={() => handleToggle(course._id, course.name)}>
                  {course.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {course.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(course)}>
                  <Pencil size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditCourse(null); }} title={editCourse ? 'Edit Course' : 'Add Course'}>
        <form onSubmit={handleSubmit} className="space-y-4" key={editCourse?._id}>
          <Input label="Course Name" name="name" defaultValue={editCourse?.name || ''} required />
          <Select label="Language" name="language" defaultValue={editCourse?.language || ''} required options={[
            { value: 'English', label: 'English' }, { value: 'Marathi', label: 'Marathi' }, { value: 'Hindi', label: 'Hindi' },
          ]} />
          <Input label="Duration (months)" name="duration" type="number" defaultValue={editCourse?.duration || ''} placeholder="e.g. 3" required />
          <Input label="Fee Amount" name="feesAmount" type="number" defaultValue={editCourse?.feesAmount || ''} required />
          <Input label="Description" name="description" defaultValue={editCourse?.description || ''} />
          <Button type="submit" className="w-full">{editCourse ? 'Update' : 'Create'} Course</Button>
        </form>
      </Modal>
    </div>
  );
}
