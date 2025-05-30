import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "@services/api";

// [GET] all users
export const fetchUsers = createAsyncThunk(
  "user/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest("/api/Users");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [GET] user by ID
export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getRequest(`/api/Users/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [POST] create new user
export const createUser = createAsyncThunk(
  "user/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await postRequest({ url: "/api/Users", data });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [PUT] update user
export const updateUser = createAsyncThunk(
  "user/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await putRequest({ url: `/api/Users/${id}`, data });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [DELETE] delete user
export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteRequest({ url: `/api/Users/${id}` });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [ENUM] Role (e.g: admin, staff,...)
export const fetchUserRoles = createAsyncThunk(
  "referenceData/fetchUserRoles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest("/api/ReferenceData/userroles");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [ENUM] status (e.g: active & inactive)
export const fetchUserStatuses = createAsyncThunk(
  "referenceData/fetchUserStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest("/api/ReferenceData/userstatuses");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userList: [],
    userRole: [],
    userStatus: [],
    selectedUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH ALL USERS ---
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- FETCH USER BY ID ---
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- FETCH USER ROLES ---
    .addCase(fetchUserRoles.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserRoles.fulfilled, (state, action) => {
      state.loading = false;
      state.userRole = action.payload;
    })
    .addCase(fetchUserRoles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // --- FETCH USER STATUSES ---
    .addCase(fetchUserStatuses.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserStatuses.fulfilled, (state, action) => {
      state.loading = false;
      state.userStatus = action.payload;
    })
    .addCase(fetchUserStatuses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

      // --- CREATE USER ---
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userList.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- UPDATE USER ---
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.userList.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.userList[index] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- DELETE USER ---
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = state.userList.filter((u) => u.id !== action.meta.arg);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedUser, clearError } = userSlice.actions;
export default userSlice.reducer;
