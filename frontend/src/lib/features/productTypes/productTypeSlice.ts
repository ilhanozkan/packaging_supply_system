import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { api } from "@/lib/api";

export interface ProductType {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  isActive: boolean;
  imageUrl?: string;
}

export interface CreateProductTypeData {
  name: string;
  description: string;
  isActive: boolean;
  imageUrl?: string;
}

interface ProductTypeState {
  items: ProductType[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductTypeState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProductTypes = createAsyncThunk(
  "productTypes/fetchProductTypes",
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const params = search ? { search } : {};
      const response = await api.get<ProductType[]>("/product-types", {
        params,
      });
      return response.data;
    } catch (error) {
      const standardErrMsg = "Ürün tipleri verileri alınamadı";

      if (isAxiosError(error))
        return rejectWithValue(error.response?.data?.message || standardErrMsg);

      return rejectWithValue(standardErrMsg);
    }
  }
);

export const fetchAllProductTypes = createAsyncThunk(
  "productTypes/fetchAllProductTypes",
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const params = search ? { search } : {};
      const response = await api.get<ProductType[]>("/product-types/all", {
        params,
      });
      return response.data;
    } catch (error) {
      const standardErrMsg = "Ürün tipleri verileri alınamadı";

      if (isAxiosError(error))
        return rejectWithValue(error.response?.data?.message || standardErrMsg);

      return rejectWithValue(standardErrMsg);
    }
  }
);

export const createProductType = createAsyncThunk(
  "productTypes/createProductType",
  async (productTypeData: CreateProductTypeData, { rejectWithValue }) => {
    try {
      const response = await api.post<ProductType>(
        "/product-types",
        productTypeData
      );
      return response.data;
    } catch (error) {
      const standardErrMsg = "Ürün tipi oluşturulamadı";

      if (isAxiosError(error))
        return rejectWithValue(error.response?.data?.message || standardErrMsg);

      return rejectWithValue(standardErrMsg);
    }
  }
);

export const updateProductType = createAsyncThunk(
  "productTypes/updateProductType",
  async (
    { id, data }: { id: string; data: Partial<CreateProductTypeData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ProductType>(`/product-types/${id}`, data);
      return response.data;
    } catch (error) {
      const standardErrMsg = "Ürün tipi güncellenemedi";

      if (isAxiosError(error))
        return rejectWithValue(error.response?.data?.message || standardErrMsg);

      return rejectWithValue(standardErrMsg);
    }
  }
);

export const deleteProductType = createAsyncThunk(
  "productTypes/deleteProductType",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/product-types/${id}`);
      return id;
    } catch (error) {
      const standardErrMsg = "Ürün tipi silinemedi";

      if (isAxiosError(error))
        return rejectWithValue(error.response?.data?.message || standardErrMsg);

      return rejectWithValue(standardErrMsg);
    }
  }
);

const productTypeSlice = createSlice({
  name: "productTypes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch product types
      .addCase(fetchProductTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProductTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch all product types
      .addCase(fetchAllProductTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProductTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllProductTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create product type
      .addCase(createProductType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProductType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createProductType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update product type
      .addCase(updateProductType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProductType.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProductType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete product type
      .addCase(deleteProductType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProductType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteProductType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = productTypeSlice.actions;
export default productTypeSlice.reducer;
