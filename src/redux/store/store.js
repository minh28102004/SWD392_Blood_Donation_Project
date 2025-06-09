import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import blogPostsReducer from "../features/blogPostsSlice";
import bloodReducer from "../features/bloodSlice";
import bloodDonation from "../features/bloodDonationSlice";
import BloodRequestReducer from "../features/bloodRequestSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    blogPosts: blogPostsReducer,
    blood: bloodReducer,
    donationRequests: bloodDonation
    bloodRequest: BloodRequestReducer
  },
});
