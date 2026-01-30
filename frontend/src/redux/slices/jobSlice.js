import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    jobs: [],
    job: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    isCreateSuccess: false,
    message: ''
};

// Get all jobs
export const getJobs = createAsyncThunk('jobs/getAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/jobs');
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get recruiter's jobs
export const getMyJobs = createAsyncThunk('jobs/getMy', async (_, thunkAPI) => {
    try {
        const response = await api.get('/jobs/my');
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create Job
export const createJob = createAsyncThunk('jobs/create', async (jobData, thunkAPI) => {
    try {
        const response = await api.post('/jobs', jobData);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isCreateSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getJobs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.jobs = action.payload?.jobs || [];
            })
            .addCase(getJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMyJobs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.jobs = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getMyJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createJob.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isCreateSuccess = true;
                state.jobs.push(action.payload);
            })
            .addCase(createJob.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = jobSlice.actions;
export default jobSlice.reducer;
