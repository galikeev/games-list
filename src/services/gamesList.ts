import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Game } from '../types/Game';

export const gamesApi = createApi({
  reducerPath: 'gamesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/games.json' }),
  endpoints: (builder) => ({
    getGamesList: builder.query<Game[], string>({
      query: () => ({
        url: '',
      }),
      transformResponse: (response: Record<string, Game>) => {
        return Object.entries(response).map(([id, game]) => ({
          id,
          ...game,
        }));
      },
    }),
  }),
});

export const { useGetGamesListQuery } = gamesApi;
