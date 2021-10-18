import { configureStore } from '@reduxjs/toolkit';

import boardReducer from './slices/boardSlice';
import chatReducer from './slices/chatSlice';
import itemsReducer from './slices/itemsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        board: boardReducer,
        chat: chatReducer,
        items: itemsReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
