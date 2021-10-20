import { TypedUseSelectorHook, useSelector as ogUseSelector } from 'react-redux';
import type { RootState } from '../store/store';

const useSelector: TypedUseSelectorHook<RootState> = ogUseSelector;
export default useSelector;
