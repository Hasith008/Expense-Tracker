import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getTransactions: builder.query({
      query: () => '/transactions',
      providesTags: ['Transaction'],
    }),
    addTransaction: builder.mutation({
      query: (newTransaction) => ({
        url: '/transactions',
        method: 'POST',
        body: newTransaction,
      }),
      invalidatesTags: ['Transaction'],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transaction'],
    }),
    // NEW: Third-Party API Endpoint for Currency Exchange Rates
    getExchangeRates: builder.query({
      query: () => 'https://open.er-api.com/v6/latest/USD',
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useGetExchangeRatesQuery, // <--- Exported the new third-party query hook
} = apiSlice;