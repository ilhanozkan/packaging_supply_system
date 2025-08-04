import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api } from "@/lib/api";

export interface SupplierInterest {
  id: string;
  isInterested: boolean;
  offerPrice?: number;
  createdAt: Date;
  supplierId: string;
  orderRequestId: string;
  supplier?: {
    id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  };
  orderRequest?: {
    id: string;
    title: string;
    description?: string;
    expirationDate: Date;
  };
}

export interface CreateSupplierInterestData {
  orderRequestId: string;
  isInterested: boolean;
  offerPrice?: number;
}

export interface UpdateSupplierInterestData {
  isInterested?: boolean;
  offerPrice?: number;
}

interface SupplierInterestState {
  items: SupplierInterest[];
  myInterests: SupplierInterest[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SupplierInterestState = {
  items: [],
  myInterests: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAllSupplierInterests = createAsyncThunk(
  "supplierInterests/fetchAllSupplierInterests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<SupplierInterest[]>("/supplier-interests");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Tedarikçi ilgi alanları verileri alınamadı"
      );
    }
  }
);

export const fetchMySupplierInterests = createAsyncThunk(
  "supplierInterests/fetchMySupplierInterests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<SupplierInterest[]>(
        "/supplier-interests/my-interests"
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Tedarikçi ilgi alanları verileri alınamadı"
      );
    }
  }
);

export const fetchSupplierInterestsByOrderRequest = createAsyncThunk(
  "supplierInterests/fetchSupplierInterestsByOrderRequest",
  async (orderRequestId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<SupplierInterest[]>(
        `/supplier-interests/order-request/${orderRequestId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Tedarikçi ilgi alanları verileri alınamadı"
      );
    }
  }
);

export const fetchSupplierInterestById = createAsyncThunk(
  "supplierInterests/fetchSupplierInterestById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<SupplierInterest>(
        `/supplier-interests/${id}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Tedarikçi ilgi alanı verileri alınamadı"
      );
    }
  }
);

export const createSupplierInterest = createAsyncThunk(
  "supplierInterests/createSupplierInterest",
  async (interestData: CreateSupplierInterestData, { rejectWithValue }) => {
    try {
      const response = await api.post<SupplierInterest>(
        "/supplier-interests",
        interestData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Tedarikçi ilgi alanı oluşturulamadı"
      );
    }
  }
);

export const updateSupplierInterest = createAsyncThunk(
  "supplierInterests/updateSupplierInterest",
  async (
    { id, data }: { id: string; data: UpdateSupplierInterestData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<SupplierInterest>(
        `/supplier-interests/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Tedarikçi ilgi alanı güncellenemedi"
      );
    }
  }
);

export const deleteSupplierInterest = createAsyncThunk(
  "supplierInterests/deleteSupplierInterest",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/supplier-interests/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Tedarikçi ilgi alanı silinemedi"
      );
    }
  }
);

const supplierInterestSlice = createSlice({
  name: "supplierInterests",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all supplier interests (admin)
      .addCase(fetchAllSupplierInterests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllSupplierInterests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllSupplierInterests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch my supplier interests
      .addCase(fetchMySupplierInterests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMySupplierInterests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myInterests = action.payload;
      })
      .addCase(fetchMySupplierInterests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch supplier interests by order request
      .addCase(fetchSupplierInterestsByOrderRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSupplierInterestsByOrderRequest.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.items = action.payload;
        }
      )
      .addCase(
        fetchSupplierInterestsByOrderRequest.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        }
      )
      // Fetch supplier interest by ID
      .addCase(fetchSupplierInterestById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSupplierInterestById.fulfilled, (state, action) => {
        state.isLoading = false;
        const exists = state.items.find(
          (item) => item.id === action.payload.id
        );
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchSupplierInterestById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create supplier interest
      .addCase(createSupplierInterest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSupplierInterest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
        state.myInterests.push(action.payload);
      })
      .addCase(createSupplierInterest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update supplier interest
      .addCase(updateSupplierInterest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSupplierInterest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        const myIndex = state.myInterests.findIndex(
          (item) => item.id === action.payload.id
        );
        if (myIndex !== -1) {
          state.myInterests[myIndex] = action.payload;
        }
      })
      .addCase(updateSupplierInterest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete supplier interest
      .addCase(deleteSupplierInterest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSupplierInterest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.myInterests = state.myInterests.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteSupplierInterest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = supplierInterestSlice.actions;
export default supplierInterestSlice.reducer;
