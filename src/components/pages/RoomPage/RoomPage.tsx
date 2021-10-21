import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { useSelector, useDispatch } from '../../../hooks';
import { connectToRoom } from '../../../store/slices/connectionSlice';
import { Canvas, TestChat, CanvasUI } from '../../common';

import './RoomPage.scss';

const RoomPage = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { isLoading, isConnected, error } = useSelector((s) => s.connection);
    const { roomId } = useParams<{ roomId: string }>();
    const password = new URLSearchParams(location.search).get('password') || undefined;

    useEffect(() => {
        if (roomId) dispatch(connectToRoom(roomId, password));
    }, [roomId, password]);

    return (
        <div className="room-page">
            {isConnected && (
                <>
                    <div className="canvas-container">
                        <Canvas />
                        <CanvasUI />
                    </div>
                    <div className="ui-container">
                        <div className="chat-container">
                            <TestChat />
                        </div>
                        <div className="temp-tools-container">TEMP</div>
                    </div>
                </>
            )}
            {isLoading && <h1>LOADING</h1>}
            {error && <h1>Error: {error}</h1>}
        </div>
    );
};

export default RoomPage;
