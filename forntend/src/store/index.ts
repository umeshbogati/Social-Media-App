// filepath: src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { authReducer, postReducer } from "./slices";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
