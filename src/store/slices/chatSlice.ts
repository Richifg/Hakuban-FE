import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '../../interfaces/items';

interface ChatState {
    messages: ChatMessage[];
    unreadMessageCount: number;
    lastReadMessageId?: string;
}

const initialState: ChatState = {
    messages: [],
    unreadMessageCount: 0,
};

const slice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
            state.messages = action.payload;
        },
        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
        },
        deleteMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter((m) => m.id !== action.payload);
        },
        resetUnreadMessages: (state) => {
            state.unreadMessageCount = 0;
        },
        increaseUnreadMessages: (state) => {
            state.unreadMessageCount++;
        },
        setLastReadMessageId: (state, action: PayloadAction<string>) => {
            state.lastReadMessageId = action.payload;
        },
    },
});

export const { setMessages, addMessage, deleteMessage, resetUnreadMessages, increaseUnreadMessages, setLastReadMessageId } =
    slice.actions;

export default slice.reducer;
