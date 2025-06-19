import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // sử dụng localStorage

// [data]Reducer
import userReducer from "../features/userSlice";
import blogPostsReducer from "../features/blogPostsSlice";
import bloodReducer from "../features/bloodSlice";
import bloodInventoryReducer from "../features/bloodInvSlice";
import bloodDonation from "../features/bloodDonationSlice";
import bloodRequestReducer from "../features/bloodRequestSlice";
import authReducer from "../features/authSlice";

// Cấu hình redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Tạo store
export const store = configureStore({
  reducer: {
    user: userReducer,
    blogPosts: blogPostsReducer,
    blood: bloodReducer,
    bloodInventory: bloodInventoryReducer,
    donationRequests: bloodDonation,
    bloodRequest: bloodRequestReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Khởi tạo persistor
export const persistor = persistStore(store);
