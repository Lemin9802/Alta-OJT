import { configureStore } from '@reduxjs/toolkit';
import devicesReducer from './deviceSlice';

export const store = configureStore({
  reducer: {
    devices: devicesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
