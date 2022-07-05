import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDefaultUser } from '../../utils';
import { User } from '../../interfaces';

interface UsersSliceState {
    users: { [id: string]: User };
    ownUser?: User;
    isLoading: boolean;
}

const initialState: UsersSliceState = {
    users: {},
    isLoading: false,
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
                if (user.id === state.ownUser?.id) {
                    state.ownUser = nonEmptyUser;
                    state.isLoading = false;
                }
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
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setUsers, addUsers, removeUser, setOwnUser, setIsLoading } = slice.actions;

export default slice.reducer;
