import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequestMultipartFormData,
  putRequestMultipartFormData,
  deleteRequest,
} from "@services/API/api";

const initialState = {
  bloodComponentList: [],
  totalCount: 0,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 8,
};

// [GET] all blood components
export const fetchAllBloodComponents = createAsyncThunk(
  "bloodComponent/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest("/api/BloodComponents");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// [GET] blood components with search parameters
export const fetchBloodComponents = createAsyncThunk(
  "bloodComponent/fetchAll",
  async ({ page = 1, size = 8 }, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams({
        page: page.toString(),
        pageSize: size.toString(),
      }).toString();
      const res = await getRequest(`/api/BloodComponents?${queryString}`);
      return {
        list: res.data,
        totalCount: res.data.length,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/// [GET] blood component by ID
export const fetchBloodComponentById = createAsyncThunk(
  "bloodComponent/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getRequest(`/api/BloodComponents/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [POST] create new blood components (multipart/form-data)
export const createBloodComponent = createAsyncThunk(
  "bloodComponent/create",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const res = await postRequestMultipartFormData({
        url: "/api/BloodComponents",
        formData,
      });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// [PUT] update blood components (multipart/form-data)
export const updateBloodComponent = createAsyncThunk(
  "bloodComponent/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await putRequestMultipartFormData({
        url: `/api/BloodComponents/${id}`,
        formData,
      });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [DELETE] delete blood components by id
export const deleteBloodComponent = createAsyncThunk(
  "bloodComponent/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteRequest({ url: `/api/BloodComponents/${id}` });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
const bloodComponentSlice = createSlice({
  name: "bloodComponent",
  initialState: {
    bloodComponentList: [],
    selectedBloodComponent: null,
    loading: false,
    error: null,
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 7,
  },
  reducers: {
    clearSelectedBloodComponent: (state) => {
      state.selectedBloodComponent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      const { totalCount, totalPages, currentPage, pageSize } = action.payload;
      state.totalCount = totalCount;
      state.totalPages = totalPages;
      state.currentPage = currentPage;
      state.pageSize = pageSize;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL BLOOD COMPONENTS
      .addCase(fetchAllBloodComponents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBloodComponents.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodComponentList = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchAllBloodComponents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BLOOD COMPONENT BY ID
      .addCase(fetchBloodComponentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBloodComponentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBloodComponent = action.payload;
      })
      .addCase(fetchBloodComponentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE BLOOD COMPONENT
      .addCase(createBloodComponent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBloodComponent.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodComponentList.push(action.payload);
      })
      .addCase(createBloodComponent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE BLOOD COMPONENT
      .addCase(updateBloodComponent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBloodComponent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bloodComponentList.findIndex(
          (blood) => blood.id === action.payload.id
        );
        if (index !== -1) {
          state.bloodComponentList[index] = action.payload;
        }
        if (state.selectedBloodComponent?.id === action.payload.id) {
          state.selectedBloodComponent = action.payload;
        }
      })
      .addCase(updateBloodComponent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE BLOOD COMPONENT
      .addCase(deleteBloodComponent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBloodComponent.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodComponentList = state.bloodComponentList.filter(
          (blood) => blood.id !== action.meta.arg
        );
        if (state.selectedBloodComponent?.id === action.meta.arg) {
          state.selectedBloodComponent = null;
        }
      })
      .addCase(deleteBloodComponent.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
export const {
  clearSelectedBloodComponent,
  clearError,
  setPagination,
  setCurrentPage,
  setPageSize,
} = bloodComponentSlice.actions;

export default bloodComponentSlice.reducer;
