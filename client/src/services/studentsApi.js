import { api } from './api';

export const studentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: ({ page = 1, limit = 10, search = '', subject = '', isApproved = '' }) =>
        `/students?page=${page}&limit=${limit}&search=${search}&subject=${subject}${isApproved ? `&isApproved=${isApproved}` : ''}`,
      providesTags: ['Students'],
    }),
    getStudent: builder.query({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),
    createStudent: builder.mutation({
      query: (formData) => ({ url: '/students', method: 'POST', body: formData }),
      invalidatesTags: ['Students'],
    }),
    updateStudent: builder.mutation({
      query: ({ id, formData }) => ({ url: `/students/${id}`, method: 'PUT', body: formData }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Students'],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({ url: `/students/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Students'],
    }),
    approveStudent: builder.mutation({
      query: ({ id, isApproved }) => ({ url: `/students/${id}/approve`, method: 'PATCH', body: { isApproved } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Students'],
    }),
  }),
});

export const {
  useGetStudentsQuery, useGetStudentQuery,
  useCreateStudentMutation, useUpdateStudentMutation, useDeleteStudentMutation,
  useApproveStudentMutation,
} = studentsApi;
