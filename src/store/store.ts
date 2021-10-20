import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import boardReducer from './slices/boardSlice';
import chatReducer from './slices/chatSlice';
import itemsReducer from './slices/itemsSlice';
import connectionReducer from './slices/connectionSlice';

export const store = configureStore({
    reducer: {
        board: boardReducer,
        chat: chatReducer,
        items: itemsReducer,
        connection: connectionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
