import { useDispatch as ogUseDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';

const useDispatch: typeof ogUseDispatch = () => ogUseDispatch<AppDispatch>();

export default useDispatch;
