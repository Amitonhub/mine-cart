// api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.REACT_APP_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/api`,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: '/login',
        method: 'POST',
        body: userData,
      }),
    }),
    getUserDetails: builder.query({
      query: () => ({
        url: '/getUserDetails',
        method: 'GET',
      }),
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: '/add-product',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }]
    }),
    updateProduct: builder.mutation({
      query: (productId) => ({
        url: '/update-product',
        method: 'POST',
        body: productId,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }]
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: '/delete-product',
        method: 'POST',
        body: productId,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }]
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: '/all-products',
        method: 'GET',
      }),
      providesTags: [{ type: 'Products', id: 'LIST' }]
    })
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetUserDetailsQuery, useAddProductMutation,useDeleteProductMutation, useUpdateProductMutation, useGetAllProductsQuery } = api;