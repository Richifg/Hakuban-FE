import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { WSService, TestService } from '../../services';
import { BoardItem, UpdateData, ItemsLock } from '../../interfaces';

interface ConectionState {
    userId: string;
    roomId: string;
    isLoading: boolean;
    isConnected: boolean;
    dataToSync: { [key: string]: BoardItem | UpdateData };
    itemsLock: ItemsLock;
    error: string;
}

const initialState: ConectionState = {
    userId: '',
    roomId: '',
    isLoading: false,
    isConnected: false,
    dataToSync: {},
    itemsLock: {},
    error: '',
};

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        setUserId(state, action: PayloadAction<string>) {
            state.userId = action.payload;
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
        addSyncData(state, action: PayloadAction<(BoardItem | UpdateData)[]>) {
            action.payload.forEach((newData) => {
                const { id } = newData;
                const oldData = state.dataToSync[id];
                // full items replace whatever was stored for sync
                if (newData.creationDate || !oldData) state.dataToSync[id] = newData;
                // updateData updates existing sync data
                else state.dataToSync[id] = { ...oldData, ...newData };
            });
        },
        removeSyncData(state, action: PayloadAction<string[]>) {
            const ids = action.payload;
            ids.forEach((id) => {
                delete state.dataToSync[id];
            });
        },
        syncData(state) {
            const { dataToSync } = state;
            const items: BoardItem[] = [];
            const updates: UpdateData[] = [];
            // separate new items from updates
            Object.values(dataToSync).forEach((data) => {
                if (data.creationDate) items.push(data as BoardItem);
                else updates.push(data as UpdateData);
            });
            // new items are sent first so updates that reference new items make sense
            // (e.g. connecting a new Line to and old Item)
            items.length && WSService.addItems(items);
            updates.length && WSService.updateItems(updates);
            state.dataToSync = {};
        },
        setItemsLock(state, action: PayloadAction<ItemsLock>) {
            state.itemsLock = action.payload;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
    },
});

export const {
    setUserId,
    setRoomId,
    setIsLoading,
    setIsConnected,
    addSyncData,
    removeSyncData,
    syncData,
    setItemsLock,
    setError,
} = connectionSlice.actions;

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
        // TODO: can't catch the errors from createRoom here
        const { success, data } = await TestService.createRoom();
        if (success) dispatch(setRoomId(data));
        else dispatch(setError(data));
    } catch (e) {
        console.log(e, typeof e);
        const error = !e ? 'connection error' : (e as string);
        dispatch(setError(error));
    } finally {
        dispatch(setIsLoading(false));
    }
};

export default connectionSlice.reducer;
