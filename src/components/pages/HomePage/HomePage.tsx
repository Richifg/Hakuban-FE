import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { useDispatch, useSelector } from '../../../hooks';
import { createRoom } from '../../../store/slices/connectionSlice';

import './HomePage.scss';

const HomePage = (): React.ReactElement => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [newRoomId, setNewRoomId] = useState('');
    const [password, setPassword] = useState('');
    const { roomId, isLoading } = useSelector((s) => s.connection);

    useEffect(() => {
        if (roomId) {
            history.push(`/room/${roomId}`);
        }
    }, [roomId]);

    const handleJoinRoom = () => {
        history.push(`/room/${newRoomId}` + (password ? `?password=${password}` : ''));
    };

    const handleCreateRoom = () => {
        dispatch(createRoom());
    };

    return (
        <div className="home-page">
            <section>
                <h1>Create a room</h1>
                <button disabled={isLoading} onClick={handleCreateRoom}>
                    Create
                </button>
            </section>
            <section>
                <h1>Join a room</h1>
                <label>
                    roomId:
                    <input value={newRoomId} onChange={({ currentTarget }) => setNewRoomId(currentTarget.value)} />
                </label>
                <label>
                    password:
                    <input type="password" value={password} onChange={({ currentTarget }) => setPassword(currentTarget.value)} />
                </label>
                <button disabled={isLoading} onClick={handleJoinRoom}>
                    Join
                </button>
            </section>
        </div>
    );
};

export default HomePage;
