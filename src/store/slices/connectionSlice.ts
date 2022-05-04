import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { WSService, TestService } from '../../services';
import { BoardItem, UpdateData } from '../../interfaces';

interface ConectionState {
    id: string;
    roomId: string;
    isLoading: boolean;
    isConnected: boolean;
    dataToSync: { [key: string]: BoardItem | UpdateData };
    error: string;
}

const initialState: ConectionState = {
    id: '',
    roomId: '',
    isLoading: false,
    isConnected: false,
    dataToSync: {},
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
        addSyncData: (state, action: PayloadAction<(BoardItem | UpdateData)[]>) => {
            action.payload.forEach((newData) => {
                const { id } = newData;
                const oldData = state.dataToSync[id];
                // full items replace whatever was stored for sync
                if (newData.creationDate || !oldData) state.dataToSync[id] = newData;
                // updateData updates existing sync data
                else state.dataToSync[id] = { ...oldData, ...newData };
            });
        },
        syncData: (state) => {
            const items: BoardItem[] = [];
            const updates: UpdateData[] = [];
            // first send new items and then updates
            Object.values(state.dataToSync).forEach((data) => {
                if (data.creationDate) items.push(data as BoardItem);
                else updates.push(data);
            });
            items.length && WSService.addItems(items);
            updates.length && WSService.updateItems(updates);
            state.dataToSync = {};
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
    },
});

export const { setId, setRoomId, setIsLoading, setIsConnected, addSyncData, syncData, setError } = connectionSlice.actions;

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
