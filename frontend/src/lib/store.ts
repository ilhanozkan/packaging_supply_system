import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/auth/authSlice";
import productTypeReducer from "./features/productTypes/productTypeSlice";
import orderRequestReducer from "./features/orderRequests/orderRequestSlice";
import supplierInterestReducer from "./features/supplierInterests/supplierInterestSlice";
import userReducer from "./features/users/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    productTypes: productTypeReducer,
    orderRequests: orderRequestReducer,
    supplierInterests: supplierInterestReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
