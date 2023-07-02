import { createSlice } from '@reduxjs/toolkit';
import { gamesApi } from '../../services/gamesList';
import { Game } from '../../types/Game';

interface GamesState {
  displayedGames: number;
  providers: string[];
  games: Game[];
  realKeys: string[];
  selectedProvider: string;
  selectedReal: string;
}

const initialState: GamesState = {
  displayedGames: 12,
  providers: [],
  games: [],
  realKeys: [],
  selectedProvider: '',
  selectedReal: '',
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    addMoreGames(state) {
      state.displayedGames += 12;
    },
    collectProviders(state) {
      const uniqueProviders = [...new Set(state.games.map((game) => game.provider))];
      state.providers = uniqueProviders;
    },
    updateRealKeys(state) {
      const realKeys = state.games.reduce<string[]>((keys, game) => {
        const gameRealKeys = Object.keys(game.real);
        return [...keys, ...gameRealKeys];
      }, []);
      state.realKeys = [...new Set(realKeys)];
    },
    selectProvider(state, action) {
      state.selectedProvider = action.payload;
    },
    selectRealKey(state, action) {
      state.selectedReal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(gamesApi.endpoints.getGamesList.matchFulfilled, (state, action) => {
      state.games = action.payload;
    });
  },
});

export const { addMoreGames, collectProviders, updateRealKeys, selectProvider, selectRealKey } = gamesSlice.actions;

export default gamesSlice.reducer;
