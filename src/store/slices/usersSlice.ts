import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../interfaces';

interface UsersSliceState {
    users: { [id: string]: User };
    ownUser?: User;
}

const initialState: UsersSliceState = {
    users: {},
};

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        setUsers(state, action: PayloadAction<User[]>) {
            const users = action.payload;
            users.forEach((user) => (state.users[user.id] = user));
        },
        addUser(state, action: PayloadAction<User>) {
            const user = action.payload;
            state.users[user.id] = user;
        },
        removeUser(state, action: PayloadAction<string>) {
            delete state.users[action.payload];
        },
        setOwnUser(state, action: PayloadAction<User>) {
            state.ownUser = action.payload;
        },
    },
});

export const { setUsers, addUser, removeUser, setOwnUser } = connectionSlice.actions;

export default connectionSlice.reducer;
