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
// Import các reducer
import userReducer from "../features/userSlice";
import blogPostsReducer from "../features/blogPostsSlice";
import bloodReducer from "../features/bloodSlice";
import bloodInventoryReducer from "../features/bloodInvSlice";
import bloodDonation from "../features/bloodDonationSlice";
import bloodRequestReducer from "../features/bloodRequestSlice";
import authReducer from "../features/authSlice";
import bloodTypeReducer from "../features/bloodTypeSlice";
import bloodComponentReducer from "../features/bloodComponentSlice";

// Cấu hình persist cho auth và user
const authPersistConfig = {
  key: "auth",
  storage,
};

const userPersistConfig = {
  key: "user",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const asyncDispatchMiddleware = (storeAPI) => (next) => (action) => {
  let syncActivityFinished = false;
  let actionQueue = [];

  function flushQueue() {
    actionQueue.forEach((a) => storeAPI.dispatch(a));
    actionQueue = [];
  }

  function asyncDispatch(asyncAction) {
    actionQueue = actionQueue.concat([asyncAction]);
    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch = Object.assign({}, action, { asyncDispatch });
  const res = next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
  return res;
};

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    auth: persistedAuthReducer,
    blogPosts: blogPostsReducer,
    blood: bloodReducer,
    donationRequests: bloodDonation,
    bloodRequest: bloodRequestReducer,
    bloodInventory: bloodInventoryReducer,
    bloodType: bloodTypeReducer,
    bloodComponent: bloodComponentReducer,
    
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(asyncDispatchMiddleware),
});

export const persistor = persistStore(store);
