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

const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers(state, action: PayloadAction<User[]>) {
            const users = action.payload;
            users.forEach((user) => (state.users[user.id] = user));
        },
        addUsers(state, action: PayloadAction<User[]>) {
            const users = action.payload;
            users.forEach((user) => {
                const nonEmptyUser = user.username ? user : getDefaultUser(user.id);
                state.users[user.id] = nonEmptyUser;
            });
        },
        removeUser(state, action: PayloadAction<string>) {
            delete state.users[action.payload];
        },
        setOwnUser(state, action: PayloadAction<User>) {
            const ownUser = action.payload;
            state.ownUser = ownUser;
            state.users[ownUser.id] = ownUser;
        },
    },
});

export const { setUsers, addUsers, removeUser, setOwnUser } = slice.actions;

export default slice.reducer;
