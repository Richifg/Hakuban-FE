import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    showAvatarMenu: boolean;
    showChat: boolean;
    showWelcomeModal: boolean;
}

const initialState: UIState = {
    showAvatarMenu: false,
    showChat: false,
    showWelcomeModal: true,
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
        setShowWelcomeModal: (state, action: PayloadAction<boolean>) => {
            state.showWelcomeModal = action.payload;
        },
    },
});

export const { setShowAvatarMenu, setShowChat, setShowWelcomeModal } = slice.actions;

export default slice.reducer;
