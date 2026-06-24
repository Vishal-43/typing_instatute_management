import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
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
