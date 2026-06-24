import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export const DataTable = ({ columns, data, loading, page, pages, onPageChange, emptyMessage = 'No records found' }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-8 text-center text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-border">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium text-text-secondary text-xs uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-text-secondary">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row._id || i} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-text-primary">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-sm text-text-secondary">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
