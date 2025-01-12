import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import accountReducer from "./slices/accountSlice";
const store = configureStore({
  reducer: {
    products: productReducer,
    accounts: accountReducer,
  },
});

export default store;
