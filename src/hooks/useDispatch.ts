import { useDispatch as ogUseDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';

export default () => ogUseDispatch<AppDispatch>();
