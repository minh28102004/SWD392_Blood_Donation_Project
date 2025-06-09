import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import blogPostsReducer from "../features/blogPostsSlice";
import bloodReducer from "../features/bloodSlice";
import BloodRequestReducer from "../features/bloodRequestSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    blogPosts: blogPostsReducer,
    blood: bloodReducer,
    bloodRequest: BloodRequestReducer
  },
});
