import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest } from "@services/api";

// [GET] all blood components
export const fetchBloodComponents = createAsyncThunk(
  "blood/fetchComponents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest("/api/BloodComponents");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [GET] all blood types
export const fetchBloodTypes = createAsyncThunk(
  "blood/fetchTypes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest("/api/BloodTypes");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const bloodSlice = createSlice({
  name: "blood",
  initialState: {
    bloodComponents: [],
    bloodTypes: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch blood components
      .addCase(fetchBloodComponents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBloodComponents.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodComponents = action.payload;
      })
      .addCase(fetchBloodComponents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch blood types
      .addCase(fetchBloodTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBloodTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodTypes = action.payload;
      })
      .addCase(fetchBloodTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = bloodSlice.actions;
export default bloodSlice.reducer;
