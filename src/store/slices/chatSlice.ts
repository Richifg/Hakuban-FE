import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// TEMP
interface Message {
    id: string;
    content: string;
}

interface ChatState {
    messages: Message[];
    unreadMessageCount: number;
}

const initialState: ChatState = {
    messages: [],
    unreadMessageCount: 0,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
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
    },
});

export const { setMessages, addMessage, deleteMessage, resetUnreadMessages, increaseUnreadMessages } =
    chatSlice.actions;

export default chatSlice.reducer;
