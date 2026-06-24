import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

// Import all API services to trigger injectEndpoints before store creation
import { api } from '../services/api';
import '../services/authApi';
import '../services/studentsApi';
import '../services/coursesApi';
import '../services/enrollmentsApi';
import '../services/feesApi';
import '../services/resultsApi';
import '../services/deadstockApi';
import '../services/expensesApi';
import '../services/visitBookApi';
import '../services/dashboardApi';
import '../services/usersApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
