import { api } from './api';

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getDashboardCharts: builder.query({
      query: () => '/dashboard/charts',
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetDashboardChartsQuery } = dashboardApi;
