import { baseApi } from "./baseApi";


const BlogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: (params) => ({
        url: "/blogs",
        method: "GET",
        params,
      }),
      providesTags: ["blogs"],
    }),
    getBlogDetails: builder.query({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "GET",
      }),
      providesTags: ["blogs"],
    }),
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: `/blogs`,
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: ["blogs"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, body }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["blogs"],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogs"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogDetailsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = BlogApi;