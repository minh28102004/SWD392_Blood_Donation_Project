import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequestMultipartFormData,
  putRequestMultipartFormData,
  deleteRequest,
  patchRequest,
} from "@services/api";

// [GET] all blood requests with search parameters
export const fetchBloodRequests = createAsyncThunk(
  "bloodRequest/fetchAll",
  async ({ page = 1, size = 8, searchParams = {} }, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams({
        page: page.toString(),
        pageSize: size.toString(),
        ...searchParams,
      }).toString();
      const res = await getRequest(`/api/BloodRequests/search?${queryString}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [GET] blood request by ID
export const fetchBloodRequestById = createAsyncThunk(
  "bloodRequest/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getRequest(`/api/BloodRequests/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [GET] blood requests by user ID
export const fetchBloodRequestsByUserId = createAsyncThunk(
  "bloodRequest/fetchByUserId",
  async (
    { userId, page = 1, pageSize = 10, searchParams = {} },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        page,
        pageSize,
        ...searchParams,
      };
      // Xóa key nào rỗng để tránh gửi params thừa
      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });
      const queryString = new URLSearchParams(params).toString();
      const res = await getRequest(
        `/api/BloodRequests/ByUser/search/${userId}?${queryString}`
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [POST] create blood request
export const createBloodRequest = createAsyncThunk(
  "bloodRequest/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await postRequestMultipartFormData({
        url: "/api/BloodRequests",
        formData,
      });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [PUT] update blood request
export const updateBloodRequest = createAsyncThunk(
  "bloodRequest/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await putRequestMultipartFormData({
        url: `/api/BloodRequests/${id}`,
        formData,
      });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [PATCH] update blood request status
// Trước đây bạn dùng FormData — giờ bỏ đi và dùng object JSON

export const updateBloodRequestStatus = createAsyncThunk(
  "bloodRequest/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await patchRequest({
        url: `/api/BloodRequests/${id}/status`,
        data: { status }, //  gửi JSON
      });

      return res; // res.data đã được trả từ patchRequest
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



// [DELETE] delete blood request
export const deleteBloodRequest = createAsyncThunk(
  "bloodRequest/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteRequest({ url: `/api/BloodRequests/${id}` });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const bloodRequestSlice = createSlice({
  name: "bloodRequest",
  initialState: {
    bloodRequestList: [],
    selectedRequest: null,
    loading: false,
    error: null,
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 7,
  },
  reducers: {
    clearSelectedRequest: (state) => {
      state.selectedRequest = null;
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
      // --- FETCH ALL BLOOD REQUESTS ---
      .addCase(fetchBloodRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBloodRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodRequestList = action.payload.requests || [];
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchBloodRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // --- FETCH BLOOD REQUESTS BY ID---
      .addCase(fetchBloodRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBloodRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRequest = action.payload;
      })
      .addCase(fetchBloodRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // --- FETCH BLOOD REQUESTS BY USER ID ---
      .addCase(fetchBloodRequestsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBloodRequestsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodRequestList = action.payload.requests || [];
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchBloodRequestsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // --- CREATE BLOOD REQUESTS ---
      .addCase(createBloodRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBloodRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodRequestList.push(action.payload);
      })
      .addCase(createBloodRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // --- UPDATE BLOOD REQUESTS ---
      .addCase(updateBloodRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
.addCase(updateBloodRequestStatus.fulfilled, (state, action) => {
  const { id, status } = action.payload || {};

  // tìm trong danh sách request
  const item = state.bloodRequestList.find(
    (r) => r.bloodRequestId === id // hoặc r.id === id tùy backend
  );

  if (item) {
    item.status = {
      id: status,
      name:
        status === 0
          ? "Pending"
          : status === 1
          ? "Successful"
          : "Cancel",
    };
  }

  state.loading = false;
})

      // --- UPDATE BLOOD REQUESTS STATUS ---
      .addCase(updateBloodRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateBloodRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // --- DELETE BLOOD REQUESTS ---
      .addCase(deleteBloodRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBloodRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodRequestList = state.bloodRequestList.filter(
          (r) => r.id !== action.meta.arg
        );
      })
      .addCase(deleteBloodRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSelectedRequest,
  clearError,
  setPagination,
  setCurrentPage,
  setPageSize,
} = bloodRequestSlice.actions;

export default bloodRequestSlice.reducer;
