import { api } from './api';

export const deadstockApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDeadStock: builder.query({
      query: () => '/deadstock',
      providesTags: ['DeadStocks'],
    }),
    createDeadStock: builder.mutation({
      query: (formData) => ({ url: '/deadstock', method: 'POST', body: formData }),
      invalidatesTags: ['DeadStocks'],
    }),
    updateDeadStock: builder.mutation({
      query: ({ id, formData }) => ({ url: `/deadstock/${id}`, method: 'PUT', body: formData }),
      invalidatesTags: ['DeadStocks'],
    }),
  }),
});

export const {
  useGetDeadStockQuery, useCreateDeadStockMutation, useUpdateDeadStockMutation,
} = deadstockApi;
