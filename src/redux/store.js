import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import userListReducer from "./slices/listUser";
const store = configureStore({
  reducer: {
    products: productReducer,
    userList: userListReducer,
  },
});

export default store;
