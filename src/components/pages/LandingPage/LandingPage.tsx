import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { useDispatch, useSelector } from '../../../hooks';
import { createRoom } from '../../../store/slices/connectionSlice';

import styles from './LandingPage.module.scss';

const HomePage = (): React.ReactElement => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [newRoomId, setNewRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [addPassword, setAddPassword] = useState(false);
    const { roomId, isLoading, error } = useSelector((s) => s.connection);

    useEffect(() => {
        if (roomId) {
            history.push(`/room/${roomId}` + (newPassword ? `?password=${newPassword}` : ''));
        }
    }, [roomId]);

    const handleJoinRoom = () => {
        history.push(`/room/${newRoomId}` + (password ? `?password=${password}` : ''));
    };

    const handleCreateRoom = () => {
        dispatch(createRoom(newPassword));
    };

    return (
        <div className={styles.landingPage}>
            <nav className={styles.navbar}>
                <a href="/">HAKUBAN</a>
            </nav>
            <main className={styles.main}>asd</main>
        </div>
    );
};

export default HomePage;
