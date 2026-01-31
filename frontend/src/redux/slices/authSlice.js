import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const getSafeInitialUser = () => {
    try {
        const userData = localStorage.getItem('userInfo');
        if (!userData) return null;
        const parsed = JSON.parse(userData);
        
        if (parsed && parsed._id && parsed.name) {
            return parsed;
        }
        
        localStorage.removeItem('userInfo');
        return null;
    } catch (e) {
        localStorage.removeItem('userInfo');
        return null;
    }
};

const initialState = {
    user: getSafeInitialUser(),
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
    needsVerification: false,
    emailForVerification: '',
    demoOTP: null
};


export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (otpData, thunkAPI) => {
    try {
        const response = await api.post('auth/verify-otp', otpData);
        if (response.data && response.data._id) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const response = await api.post('auth/login', userData);
        if (response.data && !response.data.needsVerification) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        await api.post('auth/logout', {});
    } catch (error) {
        console.error('Logout request failed', error);
    } finally {
        localStorage.removeItem('userInfo');
    }
});


export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
    try {
        const response = await api.put('auth/profile', userData);
        if (response.data) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await api.post('auth/register', userData);
        if (response.data && !response.data.needsVerification) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.needsVerification = false;
            state.emailForVerification = '';
            state.demoOTP = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.needsVerification) {
                    state.needsVerification = true;
                    state.emailForVerification = action.payload.email;
                    state.message = action.payload.message;
                    state.demoOTP = action.payload.otp;
                } else {
                    state.isSuccess = true;
                    state.user = action.payload;
                }
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.needsVerification) {
                    state.needsVerification = true;
                    state.emailForVerification = action.payload.email;
                    state.message = action.payload.message;
                    state.demoOTP = action.payload.otp;
                } else {
                    state.isSuccess = true;
                    state.user = action.payload;
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(verifyOTP.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.needsVerification = false;
                state.emailForVerification = '';
                state.demoOTP = null;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.message = 'Profile updated successfully';
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.needsVerification = false;
                state.emailForVerification = '';
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
