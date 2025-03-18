import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import accountReducer from "./slices/accountSlice";
import sidebarReducer from "./slices/sidebarSlice";
import authReducer from "./slices/authSlice";
import storeReducer from "./slices/storeSlice";
import userAuthReducer from "./slices/userAuthSlice";
import storeAuthSlice from "./slices/storeAuthSlice";
import storeRegistrationSlice from "./slices/storeRegistrationSlice";
import userRequest from "./slices/userRequestSlice";
import trainerSlice from "./slices/trainerSlice";
import materialCategorySlice from "./slices/materialCategorySlice";
import comboSlice from "./slices/comboSlice";
import cartSlice from "./slices/cartSlice";
import addressSlice from "./slices/addressSlice";
import orderSlice from "./slices/orderSlice";
import labSlice from './slices/labSlice';
const store = configureStore({
  reducer: {
    orders: orderSlice,
    carts: cartSlice,
    products: productReducer,
    accounts: accountReducer,
    sidebar: sidebarReducer,
    auth: authReducer,
    userAuth: userAuthReducer,
    store: storeReducer,
    storeAuth: storeAuthSlice,
    storeRegistration: storeRegistrationSlice,
    userrequest: userRequest,
    trainerRegister: trainerSlice,
    materialCategory: materialCategorySlice,
    combo: comboSlice,
    address: addressSlice,
    lab: labSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
