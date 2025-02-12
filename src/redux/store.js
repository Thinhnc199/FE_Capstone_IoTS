import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import accountReducer from "./slices/accountSlice";
import sidebarReducer from "./slices/sidebarSlice";
import userRequest from "./slices/userRequestSlice";
const store = configureStore({
  reducer: {
    products: productReducer,
    accounts: accountReducer,
    sidebar: sidebarReducer,
    userrequest: userRequest,
  },
});
export default store;
