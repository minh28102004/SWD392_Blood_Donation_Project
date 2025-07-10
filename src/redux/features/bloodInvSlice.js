import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequestMultipartFormData,
  putRequestMultipartFormData,
  deleteRequest,
} from "@services/api";

// [GET] all blood inventories
export const fetchAllBloodInventories = createAsyncThunk(
  "bloodInventory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest("/api/BloodInventories");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// [GET] blood inventories with search parameters
export const fetchBloodInventories = createAsyncThunk(
  "bloodInventory/fetchAll",
  async ({ page = 1, size = 5, searchParams = {} }, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams({
        page: page.toString(),
        pageSize: size.toString(),
        ...searchParams,
      }).toString();
      const res = await getRequest(
        `/api/BloodInventories/search?${queryString}`
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/// [GET] blood inventory by ID
export const fetchBloodInventoryById = createAsyncThunk(
  "bloodInventory/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getRequest(`/api/BloodInventories/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [POST] create new blood inventory (multipart/form-data)
export const createBloodInventory = createAsyncThunk(
  "bloodInventory/create",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const res = await postRequestMultipartFormData({
        url: "/api/BloodInventories",
        formData,
      });
      console.log("Create Blood Inventory Response:", res.data);
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// [PUT] update blood inventory (multipart/form-data)
export const updateBloodInventory = createAsyncThunk(
  "bloodInventory/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await putRequestMultipartFormData({
        url: `/api/BloodInventories/${id}`,
        formData,
      });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [DELETE] delete blood inventory by id
export const deleteBloodInventory = createAsyncThunk(
  "bloodInventory/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteRequest({ url: `/api/BloodInventories/${id}` });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
const bloodInventorySlice = createSlice({
  name: "bloodInventory",
  initialState: {
    bloodList: [],
    selectedBlood: null,
    loading: false,
    error: null,
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 7,
  },
  reducers: {
    clearSelectedBloodInventory: (state) => {
      state.selectedBloodInventory = null;
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
      // FETCH ALL BLOOD INVENTORIES
      .addCase(fetchAllBloodInventories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBloodInventories.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodList = action.payload.inventories || [];
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        console.log("Total Pages:", action.payload.totalPages);
        console.log("Total Count:", action.payload.totalCount);
        console.log("Current Page:", action.payload.currentPage);
        if (action.payload.totalPages < action.payload.currentPage && action.payload.totalPages > 0) {
          action.payload.currentPage = action.payload.totalPages;
        }
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchAllBloodInventories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     

      // FETCH BLOOD INVENTORY BY ID
      .addCase(fetchBloodInventoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBloodInventoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlood = action.payload;
      })
      .addCase(fetchBloodInventoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE BLOOD INVENTORY
      .addCase(createBloodInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBloodInventory.fulfilled, (state, action) => {
        state.loading = false;
        
      })
      
      .addCase(createBloodInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE BLOOD INVENTORY
      .addCase(updateBloodInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBloodInventory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bloodList.findIndex(
          (blood) => blood.id === action.payload.id
        );
        if (index !== -1) {
          state.bloodList[index] = action.payload;
        }
        if (state.selectedBlood?.id === action.payload.id) {
          state.selectedBlood = action.payload;
        }
      })
      .addCase(updateBloodInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE BLOOD INVENTORY
      .addCase(deleteBloodInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBloodInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodList = state.bloodList.filter(
          (blood) => blood.id !== action.meta.arg
        );
        if (state.selectedBlood?.id === action.meta.arg) {
          state.selectedBlood = null;
        }
      })
      .addCase(deleteBloodInventory.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
export const {
  clearSelectedBloodInventory,
  clearError,
  setPagination,
  setCurrentPage,
  setPageSize,
} = bloodInventorySlice.actions;

export default bloodInventorySlice.reducer;
