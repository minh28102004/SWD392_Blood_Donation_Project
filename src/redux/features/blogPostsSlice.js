import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequestMultipartFormData,
  putRequestMultipartFormData,
  deleteRequest,
} from "@services/API/api";

// [GET] blog posts with pagination & search
export const fetchBlogPosts = createAsyncThunk(
  "blogPosts/fetchAll",
  async (
    { key, page = 1, size = 8, searchParams = {} },
    { rejectWithValue }
  ) => {
    try {
      const queryString = new URLSearchParams({
        page: page.toString(),
        pageSize: size.toString(),
        ...searchParams,
      }).toString();
      const res = await getRequest(`/api/BlogPosts/search?${queryString}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [GET] all blog posts (optional use)
export const fetchAllBlogPosts = createAsyncThunk(
  "blogPosts/fetchAllNoPagination",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest("/api/BlogPosts");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [GET] by ID
export const fetchBlogPostById = createAsyncThunk(
  "blogPosts/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getRequest(`/api/BlogPosts/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [POST]
export const createBlogPost = createAsyncThunk(
  "blogPosts/create",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const res = await postRequestMultipartFormData({
        url: "/api/BlogPosts",
        formData,
      });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [PUT]
export const updateBlogPost = createAsyncThunk(
  "blogPosts/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await putRequestMultipartFormData({
        url: `/api/BlogPosts/${id}`,
        formData,
      });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [DELETE]
export const deleteBlogPost = createAsyncThunk(
  "blogPosts/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteRequest({ url: `/api/BlogPosts/${id}` });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --------------------------------------

const blogPostsSlice = createSlice({
  name: "blogPosts",
  initialState: {
    blogList: [],
    selectedPost: null,
    loading: false,
    error: null,
    pagination: {
      // key: { pageSize, currentPage, totalCount, totalPages }
    },
  },
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      const { key, totalCount, totalPages, currentPage, pageSize } =
        action.payload;
      state.pagination[key] = {
        totalCount,
        totalPages,
        currentPage,
        pageSize,
      };
    },
    setCurrentPage: (state, action) => {
      const { key, currentPage } = action.payload;
      if (!state.pagination[key]) state.pagination[key] = {};
      state.pagination[key].currentPage = currentPage;
    },
    setPageSize: (state, action) => {
      const { key, pageSize } = action.payload;
      if (!state.pagination[key]) state.pagination[key] = {};
      state.pagination[key].pageSize = pageSize;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH Blog Posts (with pagination)
      .addCase(fetchBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.blogList = action.payload.posts || [];

        const { key } = action.meta.arg;
        state.pagination[key] = {
          totalCount: action.payload.totalCount,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
          pageSize: action.payload.pageSize,
        };
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH by ID
      .addCase(fetchBlogPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchBlogPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.blogList.push(action.payload);
      })
      .addCase(createBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogList.findIndex(
          (post) => post.postId === action.payload.postId
        );
        if (index !== -1) {
          state.blogList[index] = action.payload;
        }
        if (state.selectedPost?.postId === action.payload.postId) {
          state.selectedPost = action.payload;
        }
      })
      .addCase(updateBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.blogList = state.blogList.filter(
          (post) => post.postId !== action.meta.arg
        );
        if (state.selectedPost?.postId === action.meta.arg) {
          state.selectedPost = null;
        }
      })
      .addCase(deleteBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSelectedPost,
  clearError,
  setPagination,
  setCurrentPage,
  setPageSize,
} = blogPostsSlice.actions;

export default blogPostsSlice.reducer;
