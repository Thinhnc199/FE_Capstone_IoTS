import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import userListReducer from "./slices/listUser";
import userDetailReducer from "./slices/detailUser";
const store = configureStore({
  reducer: {
    products: productReducer,
    userList: userListReducer,
    userDetail: userDetailReducer,
  },
});

export default store;
