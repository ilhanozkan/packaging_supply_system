import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export enum RequestStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface OrderItem {
  id: string;
  productTypeId: string;
  requestedQuantity: number;
  description: string;
  productType?: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
  };
}

export interface OrderRequest {
  id: string;
  title: string;
  description?: string;
  status: RequestStatus;
  expirationDate: Date;
  createdAt: Date;
  customerId: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  };
  orderItems: OrderItem[];
}

export interface CreateOrderRequestData {
  title: string;
  description?: string;
  orderItems: {
    productTypeId: string;
    requestedQuantity: number;
  }[];
  expirationDate: string;
}

export interface UpdateOrderRequestData {
  title?: string;
  description?: string;
  orderItems?: {
    productTypeId: string;
    requestedQuantity: number;
    description: string;
  }[];
  expirationDate?: string;
}

interface OrderRequestState {
  items: OrderRequest[];
  currentItem: OrderRequest | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderRequestState = {
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchOrderRequests = createAsyncThunk(
  "orderRequests/fetchOrderRequests",
  async (productTypeId: string | undefined, { rejectWithValue }) => {
    try {
      const params = productTypeId ? { productTypeId } : {};
      const response = await api.get<OrderRequest[]>("/order-requests", {
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Sipariş talepleri verileri alınamadı"
      );
    }
  }
);

export const fetchMyOrderRequests = createAsyncThunk(
  "orderRequests/fetchMyOrderRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<OrderRequest[]>(
        "/order-requests/my-orders"
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Kendi sipariş talepleri verileriniz alınamadı"
      );
    }
  }
);

export const fetchOrderRequestById = createAsyncThunk(
  "orderRequests/fetchOrderRequestById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<OrderRequest>(`/order-requests/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Sipariş talebi verileri alınamadı"
      );
    }
  }
);

export const createOrderRequest = createAsyncThunk(
  "orderRequests/createOrderRequest",
  async (orderRequestData: CreateOrderRequestData, { rejectWithValue }) => {
    try {
      const response = await api.post<OrderRequest>(
        "/order-requests",
        orderRequestData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Sipariş talebi oluşturulamadı"
      );
    }
  }
);

export const updateOrderRequest = createAsyncThunk(
  "orderRequests/updateOrderRequest",
  async (
    { id, data }: { id: string; data: UpdateOrderRequestData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<OrderRequest>(
        `/order-requests/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Sipariş talebi güncellenemedi"
      );
    }
  }
);

export const updateOrderRequestStatus = createAsyncThunk(
  "orderRequests/updateOrderRequestStatus",
  async (
    { id, status }: { id: string; status: RequestStatus },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<OrderRequest>(
        `/order-requests/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Sipariş talebi durumu güncellenemedi"
      );
    }
  }
);

export const deleteOrderRequest = createAsyncThunk(
  "orderRequests/deleteOrderRequest",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/order-requests/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Sipariş talebi silinemedi"
      );
    }
  }
);

const orderRequestSlice = createSlice({
  name: "orderRequests",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch order requests
      .addCase(fetchOrderRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrderRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch my order requests
      .addCase(fetchMyOrderRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOrderRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyOrderRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch order request by ID
      .addCase(fetchOrderRequestById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderRequestById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchOrderRequestById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create order request
      .addCase(createOrderRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createOrderRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update order request
      .addCase(updateOrderRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(updateOrderRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update order request status
      .addCase(updateOrderRequestStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderRequestStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(updateOrderRequestStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete order request
      .addCase(deleteOrderRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteOrderRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.currentItem?.id === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteOrderRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentItem } = orderRequestSlice.actions;
export default orderRequestSlice.reducer;
