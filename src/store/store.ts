import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
    reducer: {
        board: boardReducer,
        chat: chatReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
