import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: string;
}

const initialState: UserState = {
    id: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setId(state, action: PayloadAction<string>) {
            state.id = action.payload;
        },
    },
});

export const { setId } = userSlice.actions;

export default userSlice.reducer;
