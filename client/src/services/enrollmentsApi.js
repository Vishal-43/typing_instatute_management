import { api } from './api';

export const enrollmentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEnrollmentsByStudent: builder.query({
      query: (studentId) => `/enrollments/student/${studentId}`,
      providesTags: (result, error, studentId) => [{ type: 'Enrollment', studentId }],
    }),
    createEnrollment: builder.mutation({
      query: (data) => ({ url: '/enrollments', method: 'POST', body: data }),
      invalidatesTags: ['Enrollment'],
    }),
    updateEnrollment: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/enrollments/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Enrollment'],
    }),
  }),
});

export const {
  useGetEnrollmentsByStudentQuery, useCreateEnrollmentMutation, useUpdateEnrollmentMutation,
} = enrollmentsApi;
