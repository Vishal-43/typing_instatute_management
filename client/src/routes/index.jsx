import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { Layout } from '../components/layout/Layout';
import LoginPage from '../pages/LoginPage';
import StudentRegistrationPage from '../pages/StudentRegistrationPage';
import DashboardPage from '../pages/DashboardPage';
import StudentListPage from '../pages/StudentListPage';
import StudentFormPage from '../pages/StudentFormPage';
import StudentProfilePage from '../pages/StudentProfilePage';
import CourseListPage from '../pages/CourseListPage';
import FeeListPage from '../pages/FeeListPage';
import ResultListPage from '../pages/ResultListPage';
import DeadStockListPage from '../pages/DeadStockListPage';
import ExpenseListPage from '../pages/ExpenseListPage';
import VisitBookListPage from '../pages/VisitBookListPage';
import UserListPage from '../pages/UserListPage';

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<StudentRegistrationPage />} />
      <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
      <Route path="/students" element={<ProtectedLayout><StudentListPage /></ProtectedLayout>} />
      <Route path="/students/new" element={<ProtectedLayout><StudentFormPage /></ProtectedLayout>} />
      <Route path="/students/:id" element={<ProtectedLayout><StudentProfilePage /></ProtectedLayout>} />
      <Route path="/students/:id/edit" element={<ProtectedLayout><StudentFormPage /></ProtectedLayout>} />
      <Route path="/courses" element={<ProtectedLayout><CourseListPage /></ProtectedLayout>} />
      <Route path="/fees" element={<ProtectedLayout><FeeListPage /></ProtectedLayout>} />
      <Route path="/results" element={<ProtectedLayout><ResultListPage /></ProtectedLayout>} />
      <Route path="/deadstock" element={<ProtectedLayout><DeadStockListPage /></ProtectedLayout>} />
      <Route path="/expenses" element={<ProtectedLayout><ExpenseListPage /></ProtectedLayout>} />
      <Route path="/visits" element={<ProtectedLayout><VisitBookListPage /></ProtectedLayout>} />
      <Route path="/users" element={<ProtectedLayout><UserListPage /></ProtectedLayout>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
