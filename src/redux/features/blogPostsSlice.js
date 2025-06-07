import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequestMultipartFormData,
  putRequestMultipartFormData,
  deleteRequest,
} from "@services/api";

// [GET] all blog posts
export const fetchAllBlogPosts = createAsyncThunk(
  "blogPosts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRequest("/api/BlogPosts");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// [GET] blog posts with search parameters
export const fetchBlogPosts = createAsyncThunk(
  "user/fetchAll",
  async ({ page = 1, size = 8, searchParams = {} }, { rejectWithValue }) => {
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

// [GET] blog post by ID
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

// [POST] create new blog post (multipart/form-data)
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

// [PUT] update blog post (multipart/form-data)
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

// [DELETE] delete blog post by id
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

const blogPostsSlice = createSlice({
  name: "blogPosts",
  initialState: {
    blogList: [],
    selectedPost: null,
    loading: false,
    error: null,
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 7,
  },
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost = null;
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
      // FETCH ALL BLOG POSTS
      .addCase(fetchBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.blogList = action.payload.posts || [];
         state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BLOG POST BY ID
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

      // CREATE BLOG POST
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

      // UPDATE BLOG POST
      .addCase(updateBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogList.findIndex((post) => post.postId === action.payload.postId);
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

      // DELETE BLOG POST
      .addCase(deleteBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.blogList = state.blogList.filter((post) => post.postId !== action.meta.arg);
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

export const { clearSelectedPost, clearError, setPagination, setCurrentPage, setPageSize  } = blogPostsSlice.actions;
export default blogPostsSlice.reducer;
