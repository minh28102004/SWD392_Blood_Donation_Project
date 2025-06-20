import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI } from "@services/authAPI";
import { jwtDecode } from "jwt-decode";
import { fetchUserById } from "@redux/features/userSlice";

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, thunkAPI) => {
    try {
      const response = await loginAPI(payload); 
      const data = response; 
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      // Decode token to get userId
      const decoded = jwtDecode(data.token);
      const userId =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      // Dispatch fetchUserById
      if (userId) {
        thunkAPI.dispatch(fetchUserById(userId));
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, thunkAPI) => {
    try {
      const response = await registerAPI(payload);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Register failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    role: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.role = action.payload.role;
        localStorage.setItem("accessToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload));
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
