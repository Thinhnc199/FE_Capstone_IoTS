import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import accountReducer from "./slices/accountSlice";
import sidebarReducer from "./slices/sidebarSlice";
const store = configureStore({
  reducer: {
    products: productReducer,
    accounts: accountReducer,
    sidebar: sidebarReducer,
  },
});

export default store;
