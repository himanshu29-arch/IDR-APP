import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootreducer";
import { rtkClient } from "../services/RTKClient";
import { setupListeners } from "@reduxjs/toolkit/query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  }
  
  const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(rtkClient.middleware),
})

setupListeners(store.dispatch);

export type RootState = ReturnType <typeof store.getState>
export type AppDispatch = typeof store.dispatch;  
export const persistor = persistStore(store)