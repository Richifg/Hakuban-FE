import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    showAvatarMenu: boolean;
    showChat: boolean;
}

const initialState: UIState = {
    showAvatarMenu: false,
    showChat: false,
};

const slice = createSlice({
    name: 'UI',
    initialState,
    reducers: {
        setShowAvatarMenu: (state, action: PayloadAction<boolean>) => {
            state.showAvatarMenu = action.payload;
        },
        setShowChat: (state, action: PayloadAction<boolean>) => {
            state.showChat = action.payload;
        },
    },
});

export const { setShowAvatarMenu, setShowChat } = slice.actions;

export default slice.reducer;
