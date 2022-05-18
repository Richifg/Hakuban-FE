import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    showAvatarMenu: boolean;
}

const initialState: UIState = {
    showAvatarMenu: true,
};

const slice = createSlice({
    name: 'UI',
    initialState,
    reducers: {
        setShowAvatarMenu: (state, action: PayloadAction<boolean>) => {
            state.showAvatarMenu = action.payload;
        },
    },
});

export const { setShowAvatarMenu } = slice.actions;

export default slice.reducer;
