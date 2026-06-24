import { api } from './api';

export const resultsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getResults: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams();
        if (params.year) query.set('year', params.year);
        if (params.examSession) query.set('examSession', params.examSession);
        if (params.subject) query.set('subject', params.subject);
        return `/results?${query.toString()}`;
      },
      providesTags: ['Results'],
    }),
    createResult: builder.mutation({
      query: (formData) => ({ url: '/results', method: 'POST', body: formData }),
      invalidatesTags: ['Results'],
    }),
    deleteResult: builder.mutation({
      query: (id) => ({ url: `/results/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Results'],
    }),
  }),
});

export const { useGetResultsQuery, useCreateResultMutation, useDeleteResultMutation } = resultsApi;
