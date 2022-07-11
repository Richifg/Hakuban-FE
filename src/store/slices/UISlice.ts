import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    showAvatarMenu: boolean;
    showChat: boolean;
    showWelcomeModal: boolean;
    showShareLink: boolean;
}

const initialState: UIState = {
    showAvatarMenu: false,
    showChat: false,
    showWelcomeModal: true,
    showShareLink: false,
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
        setShowShareLink: (state, action: PayloadAction<boolean>) => {
            state.showShareLink = action.payload;
        },
    },
});

export const { setShowAvatarMenu, setShowChat, setShowWelcomeModal, setShowShareLink } = slice.actions;

export default slice.reducer;
