import { configureStore, mid } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import dataSlice from './dataSlice';
import { thunk } from 'redux-thunk';
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  cache: false,
  whitelist: ['data'],
};
const persistedReducer = persistReducer(persistConfig, dataSlice);

export const store = configureStore({
  reducer: {
    data: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/REMOVE',
          'persist/UPDATE',
        ],
      },
    }).concat(thunk),
});

export const persistor = persistStore(store);