import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import WSService from '../../services/WebSocketService';
import TestService from '../../services/testService';

interface ConectionState {
    id: string;
    roomId: string;
    isLoading: boolean;
    isConnected: boolean;
    error: string;
}

const initialState: ConectionState = {
    id: '',
    roomId: '',
    isLoading: false,
    isConnected: false,
    error: '',
};

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        setId(state, action: PayloadAction<string>) {
            state.id = action.payload;
        },
        setRoomId(state, action: PayloadAction<string>) {
            state.roomId = action.payload;
        },
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setIsConnected(state, action: PayloadAction<boolean>) {
            state.isConnected = action.payload;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
    },
});

export const { setId, setRoomId, setIsLoading, setIsConnected, setError } = connectionSlice.actions;

export const connectToRoom =
    (roomId: string, password?: string): AppThunk =>
    async (dispatch) => {
        dispatch(setIsLoading(true));
        dispatch(setIsConnected(false));
        try {
            await WSService.connect(roomId, password);
            dispatch(setIsConnected(true));
        } catch (e) {
            dispatch(setError(e as string));
        } finally {
            dispatch(setIsLoading(false));
        }
    };

export const createRoom = (): AppThunk => async (dispatch) => {
    dispatch(setIsLoading(true));
    dispatch(setIsConnected(false));
    dispatch(setRoomId(''));
    try {
        const { success, data } = await TestService.createRoom();
        if (success) dispatch(setRoomId(data));
        else dispatch(setError(data));
    } catch (e) {
        dispatch(setError(e as string));
    } finally {
        dispatch(setIsLoading(false));
    }
};

export default connectionSlice.reducer;
