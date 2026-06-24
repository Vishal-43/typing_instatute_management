import { api } from './api';

export const feesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFees: builder.query({
      query: ({ page = 1, limit = 10 }) => `/fees?page=${page}&limit=${limit}`,
      providesTags: ['Fees'],
    }),
    getFee: builder.query({
      query: (id) => `/fees/${id}`,
      providesTags: (result, error, id) => [{ type: 'Fee', id }],
    }),
    createFee: builder.mutation({
      query: (data) => ({ url: '/fees', method: 'POST', body: data }),
      invalidatesTags: ['Fees'],
    }),
    updateFee: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/fees/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Fee', id }, 'Fees'],
    }),
  }),
});

export const {
  useGetFeesQuery, useGetFeeQuery, useCreateFeeMutation, useUpdateFeeMutation,
} = feesApi;
