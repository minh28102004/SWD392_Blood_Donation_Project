import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequestMultipartFormData,
  putRequestMultipartFormData,
  deleteRequest,
  patchRequest,
} from "@services/API/api";

// [GET] All Donation Requests
export const fetchAllDonationRequests = createAsyncThunk(
  "donationRequests/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest("/api/DonationRequests");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [GET] Paginated Donation Requests
export const fetchDonationRequests = createAsyncThunk(
  "donationRequests/fetchPaginated",
  async ({ page = 1, size = 8, searchParams = {} }, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams({
        page: page.toString(),
        pageSize: size.toString(),
        ...searchParams,
      }).toString();

      const res = await getRequest(
        `/api/DonationRequests/search?${queryString}`
      );
      console.log("ResData: ", res.data);

      const { requests, totalCount, totalPages } = res.data.data;

      return {
        list: requests,
        totalCount,
        totalPages,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [GET] Single by ID
export const fetchDonationRequestById = createAsyncThunk(
  "donationRequests/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getRequest(`/api/DonationRequests/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [GET] Paginated Donation Requests by userId with filters
export const fetchDonationRequestsByUserId = createAsyncThunk(
  "donationRequests/fetchByUserId",
  async (
    { userId, page = 1, pageSize = 12, searchParams = {} },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...searchParams,
      };
      // Xóa những field rỗng hoặc undefined
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
        `/api/DonationRequests/ByUser/search/${userId}?${queryString}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [POST]
export const createDonationRequest = createAsyncThunk(
  "donationRequests/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await postRequestMultipartFormData({
        url: "/api/DonationRequests",
        formData,
      });
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [PUT]
export const updateDonationRequest = createAsyncThunk(
  "donationRequests/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await putRequestMultipartFormData({
        url: `/api/DonationRequests/${id}`,
        formData,
      });
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [DELETE]
export const deleteDonationRequest = createAsyncThunk(
  "donationRequests/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteRequest({ url: `/api/DonationRequests/${id}` });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [PATCH]
export const updateBloodDonationStatus = createAsyncThunk(
  "donationRequest/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await patchRequest({
        url: `/api/DonationRequests/status`,
        data: { id, status }, // Gửi dạng JSON
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const searchDonationRequests = createAsyncThunk(
  "donationRequests/search",
  async ({ page = 1, size = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const params = {
        page,
        pageSize: size,
        ...filters,
      };

      // Loại bỏ key có giá trị rỗng
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
        `/api/DonationRequests/search?${queryString}`
      );

      const { requests, totalCount, totalPages } = res.data.data;
      return {
        list: requests,
        totalCount,
        totalPages,
        currentPage: page,
        pageSize: size,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const bloodDonationSlice = createSlice({
  name: "donationRequests",
  initialState: {
    donationList: [],
    selectedRequest: null,
    loading: false,
    error: null,
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
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
      //searchDonationRequests
      .addCase(searchDonationRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDonationRequests.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        state.donationList = payload.list;
        state.totalCount = payload.totalCount;
        state.totalPages = payload.totalPages;
        state.currentPage = payload.currentPage;
        state.pageSize = payload.pageSize;
      })
      .addCase(searchDonationRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch paginated
      .addCase(fetchDonationRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonationRequests.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        state.donationList = payload.list || []; // ✅ Đúng key ở đây là `list`
        state.totalCount = payload.totalCount || 0;
        state.totalPages = payload.totalPages || 0;
        // Nếu bạn muốn giữ currentPage và pageSize từ state, thì không cần ghi đè ở đây
      })

      .addCase(fetchDonationRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchDonationRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonationRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRequest = action.payload || null;
      })
      .addCase(fetchDonationRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by userId ---
      .addCase(fetchDonationRequestsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonationRequestsByUserId.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        state.donationList = payload.requests || [];
        state.totalCount = payload.totalCount || 0;
        state.totalPages = payload.totalPages || 0;
        state.currentPage = payload.currentPage || 1;
        state.pageSize = payload.pageSize || 8;
      })
      .addCase(fetchDonationRequestsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createDonationRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDonationRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.donationList.push(action.payload);
      })
      .addCase(createDonationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateDonationRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDonationRequest.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.donationList.findIndex(
          (item) => item.donateRequestId === updated.donateRequestId
        );
        if (index !== -1) {
          state.donationList[index] = updated;
        }
        if (
          state.selectedRequest?.donateRequestId === updated.donateRequestId
        ) {
          state.selectedRequest = updated;
        }
      })
      .addCase(updateDonationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteDonationRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDonationRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.donationList = state.donationList.filter(
          (item) => item.donateRequestId !== action.meta.arg
        );
        if (state.selectedRequest?.donateRequestId === action.meta.arg) {
          state.selectedRequest = null;
        }
      })
      .addCase(deleteDonationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedRequest, clearError, setCurrentPage, setPageSize } =
  bloodDonationSlice.actions;

export default bloodDonationSlice.reducer;
