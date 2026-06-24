import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, Receipt, FileText,
  Archive, CircleDollarSign, Shield, LogOut, BookUser,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/fees', label: 'Fee Management', icon: Receipt },
  { to: '/results', label: 'Results', icon: FileText },
  { to: '/deadstock', label: 'Dead Stock', icon: Archive },
  { to: '/expenses', label: 'Expenses', icon: CircleDollarSign },
  { to: '/visits', label: 'Visit Book', icon: BookUser },
  { to: '/users', label: 'Admins', icon: Shield },
];

export const Sidebar = () => {
  const dispatch = useDispatch();

  return (
    <aside className="w-60 h-screen bg-white border-r border-border flex flex-col fixed left-0 top-0">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-lg font-bold text-primary">TIMS</h1>
        <p className="text-xs text-text-secondary">Typing Institute</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-100 hover:text-red-600 w-full transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};
