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
import storage from "redux-persist/lib/storage";
// [data]Reducer
import userReducer from "../features/userSlice";
import blogPostsReducer from "../features/blogPostsSlice";
import bloodReducer from "../features/bloodSlice";
<<<<<<< HEAD
import bloodInventoryReducer from "../features/bloodInvSlice";
=======
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

// Tạo store với middleware xử lý cảnh báo non-serializable
>>>>>>> 4d236ef065ed7a29b5bae58c8a0e6e69574d211c

export const store = configureStore({
  reducer: {
    user: userReducer,
    blogPosts: blogPostsReducer,
    blood: bloodReducer,
    donationRequests: bloodDonation,
    bloodRequest: bloodRequestReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua các action không tuần tự hóa của redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Khởi tạo persistor
export const persistor = persistStore(store);
<<<<<<< HEAD
    bloodInventory: bloodInventoryReducer,
=======
    donationRequests: bloodDonation
>>>>>>> 4d236ef065ed7a29b5bae58c8a0e6e69574d211c
  },
});
