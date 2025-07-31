import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer, 
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER 
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { apiSlice } from './api/apiSlice';
import userSlice from './features/userSlice';

const persistConfig = {
  key: 'OnePostAI',
  version: 1,
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  user: userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
export default store;
