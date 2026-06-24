import { api } from './api';

export const expensesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams();
        if (params.category) query.set('category', params.category);
        return `/expenses?${query.toString()}`;
      },
      providesTags: ['Expenses'],
    }),
    createExpense: builder.mutation({
      query: (formData) => ({ url: '/expenses', method: 'POST', body: formData }),
      invalidatesTags: ['Expenses'],
    }),
    updateExpense: builder.mutation({
      query: ({ id, formData }) => ({ url: `/expenses/${id}`, method: 'PUT', body: formData }),
      invalidatesTags: ['Expenses'],
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({ url: `/expenses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Expenses'],
    }),
  }),
});

export const {
  useGetExpensesQuery, useCreateExpenseMutation, useUpdateExpenseMutation, useDeleteExpenseMutation,
} = expensesApi;
