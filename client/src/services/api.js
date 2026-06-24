import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

let baseUrl = import.meta.env.VITE_API_URL || '/api/v1';
if (baseUrl !== '/api/v1' && !baseUrl.endsWith('/api/v1')) {
  baseUrl = baseUrl.replace(/\/+$/, '') + '/api/v1';
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: [
    'Student', 'Students', 'Course', 'Courses', 'Enrollment',
    'Fee', 'Fees', 'Result', 'Results', 'DeadStock', 'DeadStocks',
    'Expense', 'Expenses', 'User', 'Users', 'Dashboard', 'Visits',
  ],
  endpoints: () => ({}),
});
