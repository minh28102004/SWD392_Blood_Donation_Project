import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import blogPostsReducer from "../features/blogPostsSlice";
import bloodReducer from "../features/bloodSlice";
<<<<<<< HEAD
import bloodInventoryReducer from "../features/bloodInvSlice";
=======
import bloodDonation from "../features/bloodDonationSlice";
>>>>>>> 4d236ef065ed7a29b5bae58c8a0e6e69574d211c

export const store = configureStore({
  reducer: {
    user: userReducer,
    blogPosts: blogPostsReducer,
    blood: bloodReducer,
<<<<<<< HEAD
    bloodInventory: bloodInventoryReducer,
=======
    donationRequests: bloodDonation
>>>>>>> 4d236ef065ed7a29b5bae58c8a0e6e69574d211c
  },
});
