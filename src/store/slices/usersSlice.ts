import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDefaultUser } from '../../utils';
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
        addUsers(state, action: PayloadAction<User[]>) {
            const users = action.payload;
            users.forEach((user) => {
                const nonEmptyUser = user.userName ? user : getDefaultUser(user.id);
                state.users[user.id] = nonEmptyUser;
            });
        },
        removeUser(state, action: PayloadAction<string>) {
            delete state.users[action.payload];
        },
        setOwnUser(state, action: PayloadAction<User>) {
            state.ownUser = action.payload;
        },
    },
});

export const { setUsers, addUsers, removeUser, setOwnUser } = connectionSlice.actions;

export default connectionSlice.reducer;
