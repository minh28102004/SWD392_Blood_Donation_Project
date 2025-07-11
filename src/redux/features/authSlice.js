import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI } from "@services/API/authAPI";
import { jwtDecode } from "jwt-decode";
import { fetchUserById } from "@redux/features/userSlice";

// Helper: decode token to get userId
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];
  } catch {
    return null;
  }
};

// Helper: save to localStorage
const saveAuthToLocalStorage = (data) => {
  localStorage.setItem("accessToken", data.token);
  localStorage.setItem("user", JSON.stringify(data));
};

// Helper: extract minimal user info
const extractUserInfo = (data) => {
  return {
    name: data.name,
    email: data.email,
    userName: data.userName,
    userId: getUserIdFromToken(data.token),
  };
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, thunkAPI) => {
    try {
      const data = await loginAPI(payload);
      saveAuthToLocalStorage(data);
      const userId = getUserIdFromToken(data.token);
      if (userId) {
        await thunkAPI.dispatch(fetchUserById(userId));
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, thunkAPI) => {
    try {
      const data = await registerAPI(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Register failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // Only user info (not token or full payload)
    token: null,
    role: null,
    loading: false,
    error: null,
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
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.user = extractUserInfo(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.user = extractUserInfo(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Register failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
