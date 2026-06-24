import { api } from './api';

export const visitBookApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVisits: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams();
        if (params.purpose) query.set('purpose', params.purpose);
        return `/visits?${query.toString()}`;
      },
      providesTags: ['Visits'],
    }),
    createVisit: builder.mutation({
      query: (body) => ({ url: '/visits', method: 'POST', body }),
      invalidatesTags: ['Visits'],
    }),
    updateVisit: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/visits/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Visits'],
    }),
    deleteVisit: builder.mutation({
      query: (id) => ({ url: `/visits/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Visits'],
    }),
  }),
});

export const {
  useGetVisitsQuery, useCreateVisitMutation, useUpdateVisitMutation, useDeleteVisitMutation,
} = visitBookApi;
