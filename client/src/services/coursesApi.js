import { api } from './api';

export const coursesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => '/courses',
      providesTags: ['Courses'],
    }),
    createCourse: builder.mutation({
      query: (data) => ({ url: '/courses', method: 'POST', body: data }),
      invalidatesTags: ['Courses'],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/courses/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Courses'],
    }),
    toggleCourse: builder.mutation({
      query: (id) => ({ url: `/courses/${id}/toggle`, method: 'PATCH' }),
      invalidatesTags: ['Courses'],
    }),
  }),
});

export const {
  useGetCoursesQuery, useCreateCourseMutation,
  useUpdateCourseMutation, useToggleCourseMutation,
} = coursesApi;
