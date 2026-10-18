import { baseApi } from "./baseApi";

const SeoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSeoData: builder.query({
      query: () => ({
        url: `/contents/page-meta`,
        method: "GET",
      }),
    }),

    updateSeoData: builder.mutation({
      query: ({ data }) => ({
        url: `/contents/page-meta`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useGetSeoDataQuery, useUpdateSeoDataMutation } = SeoApi;
