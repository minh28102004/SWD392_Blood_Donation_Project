import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import blogPostsReducer from "../features/blogPostsSlice";
import bloodReducer from "../features/bloodSlice";

import bloodInventoryReducer from "../features/bloodInvSlice";

import bloodDonation from "../features/bloodDonationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    blogPosts: blogPostsReducer,
    blood: bloodReducer,

    bloodInventory: bloodInventoryReducer,

    donationRequests: bloodDonation
  }})
