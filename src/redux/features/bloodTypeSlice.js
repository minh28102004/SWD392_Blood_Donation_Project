import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequestMultipartFormData,
  putRequestMultipartFormData,
  deleteRequest,
} from "@services/API/api";

const initialState = {
  bloodTypeList: [],
  totalCount: 0,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 8,
};

// [GET] all blood types
export const fetchAllBloodTypes = createAsyncThunk(
  "bloodType/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest("/api/BloodTypes");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// [GET] blood types with search parameters
export const fetchBloodTypes = createAsyncThunk(
  "bloodType/fetchAll",
  async ({ page = 1, size = 8 }, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams({
        page: page.toString(),
        pageSize: size.toString(),
      }).toString();
      const res = await getRequest(`/api/BloodTypes?${queryString}`);
      return {
        list: res.data,
        totalCount: res.data.length,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/// [GET] blood type by ID
export const fetchBloodTypeById = createAsyncThunk(
  "bloodType/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getRequest(`/api/BloodInventories/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [POST] create new blood types (multipart/form-data)
export const createBloodType = createAsyncThunk(
  "bloodType/create",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const res = await postRequestMultipartFormData({
        url: "/api/BloodTypes",
        formData,
      });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// [PUT] update blood types (multipart/form-data)
export const updateBloodType = createAsyncThunk(
  "bloodType/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await putRequestMultipartFormData({
        url: `/api/BloodTypes/${id}`,
        formData,
      });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [DELETE] delete blood types by id
export const deleteBloodType = createAsyncThunk(
  "bloodType/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteRequest({ url: `/api/BloodTypes/${id}` });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
const bloodTypeSlice = createSlice({
  name: "bloodType",
  initialState: {
    bloodTypeList: [],
    selectedBloodType: null,
    loading: false,
    error: null,
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 7,
  },
  reducers: {
    clearSelectedBloodType: (state) => {
      state.selectedBloodType = null;
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
      // FETCH ALL BLOOD TYPES
      .addCase(fetchAllBloodTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBloodTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodTypeList = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchAllBloodTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BLOOD TYPE BY ID
      .addCase(fetchBloodTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBloodTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBloodType = action.payload;
      })
      .addCase(fetchBloodTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE BLOOD TYPE
      .addCase(createBloodType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBloodType.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodTypeList.push(action.payload);
      })
      .addCase(createBloodType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE BLOOD TYPE
      .addCase(updateBloodType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBloodType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bloodTypeList.findIndex(
          (blood) => blood.id === action.payload.id
        );
        if (index !== -1) {
          state.bloodTypeList[index] = action.payload;
        }
        if (state.selectedBloodType?.id === action.payload.id) {
          state.selectedBloodType = action.payload;
        }
      })
      .addCase(updateBloodType.rejected, (state, action) => {
        state.loading = false;
      })

      // DELETE BLOOD TYPE
      .addCase(deleteBloodType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBloodType.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodTypeList = state.bloodTypeList.filter(
          (blood) => blood.id !== action.meta.arg
        );
        if (state.selectedBloodType?.id === action.meta.arg) {
          state.selectedBloodType = null;
        }
      })
      .addCase(deleteBloodType.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
export const {
  clearSelectedBlood,
  clearError,
  setPagination,
  setCurrentPage,
  setPageSize,
} = bloodTypeSlice.actions;

export default bloodTypeSlice.reducer;
