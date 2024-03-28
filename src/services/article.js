import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const rapidApiKey = import.meta.env.VITE_APP_RAPID_API_ARTICLE_KEY;
const rapidApiHost= import.meta.env.VITE_APP_RAPID_API_HOST;
const rapidApiUrl= import.meta.env.VITE_APP_RAPID_API_BASE_URL;
const rapidApiLanguage= import.meta.env.VITE_APP_RAPID_API_LANGUAGE;

export const articleApi = createApi({
    reducerPath: 'articleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: rapidApiUrl,
        prepareHeaders: (headers) => {
            headers.set('X-RapidAPI-Key', rapidApiKey);
            headers.set('X-RapidAPI-Host', rapidApiHost);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getSummary: builder.query({
            query: (params) => `summarize?url=${encodeURIComponent(params.articleUrl)}&length=3&lang=${rapidApiLanguage}`,
        }),
    }),
})

export const { useLazyGetSummaryQuery } = articleApi
