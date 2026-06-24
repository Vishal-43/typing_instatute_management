import { Users, BookOpen, IndianRupee, FileText, Archive, CircleDollarSign } from 'lucide-react';
import { useGetDashboardStatsQuery, useGetDashboardChartsQuery } from '../services/dashboardApi';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const statCards = [
  { key: 'students', label: 'Total Students', icon: Users, color: 'bg-blue-50 text-blue-600' },
  { key: 'courses', label: 'Active Courses', icon: BookOpen, color: 'bg-green-50 text-green-600' },
  { key: 'totalFees', label: 'Fee Collection', icon: IndianRupee, color: 'bg-amber-50 text-amber-600', currency: true },
  { key: 'results', label: 'Results Uploaded', icon: FileText, color: 'bg-purple-50 text-purple-600' },
  { key: 'deadStock', label: 'Dead Stock Items', icon: Archive, color: 'bg-red-50 text-red-600' },
  { key: 'expenseTotal', label: 'Total Expenses', icon: CircleDollarSign, color: 'bg-indigo-50 text-indigo-600', currency: true },
];

const COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DashboardPage() {
  const { data: statsData, isLoading } = useGetDashboardStatsQuery();
  const { data: chartsData } = useGetDashboardChartsQuery();

  const monthlyFees = (chartsData?.data?.monthlyFees || []).map(d => ({
    name: `${monthNames[d._id.month - 1]} ${d._id.year}`,
    amount: d.total,
  }));

  const expensesByCategory = (chartsData?.data?.expensesByCategory || []).map(d => ({
    name: d._id,
    value: d.total,
  }));

  const enrollmentsOverTime = (chartsData?.data?.enrollmentsOverTime || []).map(d => ({
    name: `${monthNames[d._id.month - 1]} ${d._id.year}`,
    count: d.count,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Overview of your institute</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <Card key={card.key}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">{card.label}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">
                    {isLoading ? '...' : card.currency
                      ? `₹${(statsData?.data?.[card.key] || 0).toLocaleString('en-IN')}`
                      : (statsData?.data?.[card.key] || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <card.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><h3 className="font-semibold">Monthly Fee Collection</h3></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyFees}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className="font-semibold">Expenses by Category</h3></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={expensesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {expensesByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><h3 className="font-semibold">Enrollments Over Time</h3></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={enrollmentsOverTime}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
