import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_SERVER || 'http://localhost:4000' }),
  tagTypes: ['Document', 'Research'],
  endpoints: (builder) => ({
    
    uploadDoc: builder.mutation<
      { message: string },
      { title: string; topic: string; content: string }
    >({
      query: (body) => ({
        url: '/upload',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Document'],
    }),

    
    askQuestion: builder.mutation<
      any,
      { question: string }
    >({
      query: (body) => ({
        url: '/ask',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Research'],
    }),

    
    getTrace: builder.query<any, string>({
      query: (id) => `/trace/${id}`,
    }),
  }),
});

export const { 
  useUploadDocMutation, 
  useAskQuestionMutation, 
  useGetTraceQuery 
} = api;
