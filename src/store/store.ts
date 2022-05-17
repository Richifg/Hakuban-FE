import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import boardReducer from './slices/boardSlice';
import chatReducer from './slices/chatSlice';
import connectionReducer from './slices/connectionSlice';
import itemsReducer from './slices/itemsSlice';
import toolsReducer from './slices/toolSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
    reducer: {
        board: boardReducer,
        chat: chatReducer,
        connection: connectionReducer,
        items: itemsReducer,
        tools: toolsReducer,
        users: usersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
