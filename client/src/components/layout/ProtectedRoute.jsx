import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectToken } from '../../features/auth/authSlice';

export const ProtectedRoute = ({ children }) => {
  const token = useSelector(selectToken);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};
