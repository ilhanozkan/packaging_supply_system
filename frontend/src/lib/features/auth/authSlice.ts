import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { api } from "@/lib/api";

export enum UserRole {
  ADMIN = "admin",
  SUPPLIER = "supplier",
  CUSTOMER = "customer",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  isSupplier?: boolean;
}

export interface AuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  role: UserRole;
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isProfileFetched: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isProfileFetched: false,
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Giriş başarısız"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Kayıt başarısız"
      );
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Profil bilgileri alınamadı"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { id, email, firstName, lastName, companyName, role } =
        action.payload;

      state.user = {
        id,
        email,
        firstName,
        lastName,
        companyName,
        role,
      } as User;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { id, email, firstName, lastName, companyName, role } =
          action.payload;

        state.isLoading = false;
        state.user = {
          id,
          email,
          firstName,
          lastName,
          companyName,
          role,
        } as User;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        const { id, email, firstName, lastName, companyName, role } =
          action.payload;
        state.isLoading = false;

        state.user = {
          id,
          email,
          firstName,
          lastName,
          companyName,
          role,
        } as User;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        const { id, email, firstName, lastName, companyName, role } =
          action.payload;

        state.isLoading = false;
        state.isProfileFetched = true;
        state.user = {
          id,
          email,
          firstName,
          lastName,
          companyName,
          role,
        } as User;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.isProfileFetched = true;
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
