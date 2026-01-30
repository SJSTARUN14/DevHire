import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    applications: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
};

// Apply for a job
export const applyForJob = createAsyncThunk('applications/apply', async ({ jobId, resume }, thunkAPI) => {
    try {
        const formData = new FormData();
        formData.append('jobId', jobId);
        formData.append('resume', resume);

        const response = await axios.post('http://localhost:5000/api/applications', formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Apply for a job (External company site)
export const applyExternalJob = createAsyncThunk('applications/applyExternal', async ({ jobId }, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:5000/api/applications/external', { jobId }, { withCredentials: true });
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get My Applications
export const getMyApplications = createAsyncThunk('applications/getMy', async (_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:5000/api/applications/my', { withCredentials: true });
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get Applications for a specific job (Recruiter)
export const getJobApplications = createAsyncThunk('applications/getByJob', async (jobId, thunkAPI) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update Application Status
export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async ({ id, status }, thunkAPI) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/applications/${id}/status`, { status }, { withCredentials: true });
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(applyForJob.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(applyForJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.applications.push(action.payload);
            })
            .addCase(applyForJob.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMyApplications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyApplications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.applications = action.payload;
            })
            .addCase(getMyApplications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getJobApplications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getJobApplications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.applications = action.payload;
            })
            .addCase(getJobApplications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateApplicationStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.applications = state.applications.map((app) =>
                    app._id === action.payload._id ? { ...app, status: action.payload.status } : app
                );
            })
            .addCase(updateApplicationStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(applyExternalJob.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(applyExternalJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.applications.push(action.payload);
            })
            .addCase(applyExternalJob.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = applicationSlice.actions;
export default applicationSlice.reducer;
