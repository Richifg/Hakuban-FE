import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import WSService from '../../services/WebSocketService';

interface ConectionState {
    id: string;
    isLoading: boolean;
    isConnected: boolean;
    error: string;
}

const initialState: ConectionState = {
    id: '',
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

export const { setId, setIsLoading, setIsConnected, setError } = connectionSlice.actions;

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

export default connectionSlice.reducer;
