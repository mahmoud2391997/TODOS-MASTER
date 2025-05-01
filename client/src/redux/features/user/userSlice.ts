import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;

  phone?: string; // Added phone property
  // Add other fields as needed
}

interface UserStats {
  posts: number;
  followers: number;
  following: number;
  // Add other fields as needed
}

interface UserState {
  profile: UserProfile | null;
  stats: UserStats | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial State
const initialState: UserState = {
  profile: null,
  stats: null,
  status: 'idle',
  error: null,
};
const api = "http://localhost:3000"

// Async Thunks
export const fetchUserProfile = createAsyncThunk<UserProfile, void, { state: RootState }>(
  'user/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${api}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data); 
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk<UserProfile, Partial<UserProfile>, { state: RootState }>(
  'user/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`${api}/api/user/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changePassword = createAsyncThunk<boolean, { currentPassword: string; newPassword: string }, { state: RootState }>(
  'user/changePassword',
  async (passwordData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.put(`${api}/api/user/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUserAccount = createAsyncThunk<boolean, string, { state: RootState }>(
  'user/deleteAccount',
  async (password, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete('/api/user/account', {
        data: { password },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserStats = createAsyncThunk<UserStats, void, { state: RootState }>(
  'user/fetchStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get('/api/user/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch profile';
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.status = 'succeeded';
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to update profile';
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(changePassword.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to change password';
      })

      // Delete Account
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.profile = null;
        state.stats = null;
        state.status = 'idle';
      })

      // Fetch Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserStats.fulfilled, (state, action: PayloadAction<UserStats>) => {
        state.status = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch stats';
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserStats = (state: RootState) => state.user.stats;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;