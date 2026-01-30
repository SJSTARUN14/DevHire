import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import applicationReducer from './slices/applicationSlice';
import companyReducer from './slices/companySlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        jobs: jobReducer,
        applications: applicationReducer,
        company: companyReducer,
    },
});

export default store;
