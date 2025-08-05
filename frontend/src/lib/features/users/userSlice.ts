import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api } from "@/lib/api";
import { UserRole } from "@/lib/features/auth/authSlice";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  role: UserRole;
}

interface UserState {
  items: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<User[]>("/admin/users");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Kullanıcılar yüklenemedi"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
