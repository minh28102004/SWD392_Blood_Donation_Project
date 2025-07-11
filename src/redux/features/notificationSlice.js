import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, deleteRequest, patchRequest } from "@services/API/api";

// [GET] notifications by userId with pagination only
export const fetchNotifications = createAsyncThunk(
  "notification/fetchAll",
  async ({ userId, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      const res = await getRequest(
        `/api/Notifications/user/${userId}?${query.toString()}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [PATCH] status "read" or "unread"
export const markNotificationAsRead = createAsyncThunk(
  "notification/markAsRead",
  async ({ id, status = "Read" }, { rejectWithValue }) => {
    try {
      await patchRequest({
        url: `/api/Notifications/${id}/status`,
        data: { status },
      });

      return { id, status };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [DELETE] single notification
export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await deleteRequest({ url: `/api/Notifications/${id}` });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notificationList: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 4,
    loading: false,
    error: null,
    shouldReloadList: false, 
  },
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
    setNotificationPagination: (state, action) => {
      const { totalCount, totalPages, currentPage, pageSize } = action.payload;
      state.totalCount = totalCount;
      state.totalPages = totalPages;
      state.currentPage = currentPage;
      state.pageSize = pageSize;
    },
    setNotificationCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setNotificationPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setShouldReloadList: (state, action) => {
      state.shouldReloadList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notificationList = action.payload.data || [];
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
        // state.shouldReloadList = false; 
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const target = state.notificationList.find(
          (n) => n.notificationId === id
        );
        if (target) {
          target.status = status;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.notificationList = state.notificationList.filter(
          (n) => n.notificationId !== deletedId
        );
        state.totalCount -= 1;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearNotificationError,
  setNotificationPagination,
  setNotificationCurrentPage,
  setNotificationPageSize,
  setShouldReloadList, 
} = notificationSlice.actions;

export default notificationSlice.reducer;
