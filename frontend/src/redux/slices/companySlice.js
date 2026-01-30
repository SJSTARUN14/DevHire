import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    recruiters: [],
    stats: {
        totalRecruiters: 0,
        totalJobs: 0,
        activeJobs: 0,
        totalApplicants: 0,
        avgATS: 0
    },
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
};

// Get Company Stats
export const getCompanyStats = createAsyncThunk('company/getStats', async (_, thunkAPI) => {
    try {
        const response = await api.get('/companies/stats');
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get Recruiters
export const getRecruiters = createAsyncThunk('company/getRecruiters', async (_, thunkAPI) => {
    try {
        const response = await api.get('/companies/recruiters');
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Add Recruiter
export const addRecruiter = createAsyncThunk('company/addRecruiter', async (recruiterData, thunkAPI) => {
    try {
        const response = await api.post('/companies/recruiters', recruiterData);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const companySlice = createSlice({
    name: 'company',
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
            .addCase(getCompanyStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCompanyStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.stats = action.payload;
            })
            .addCase(getCompanyStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getRecruiters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getRecruiters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.recruiters = action.payload;
            })
            .addCase(getRecruiters.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addRecruiter.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addRecruiter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.recruiters.push(action.payload);
                state.message = 'Recruiter added successfully';
            })
            .addCase(addRecruiter.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = companySlice.actions;
export default companySlice.reducer;
