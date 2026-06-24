import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => (
  <div className="min-h-screen bg-surface">
    <Sidebar />
    <main className="ml-60 p-8">{children}</main>
  </div>
);
