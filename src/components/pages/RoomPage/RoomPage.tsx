import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router';

import { useSelector, useDispatch } from '../../../hooks';
import { connectToRoom } from '../../../store/slices/connectionSlice';
import { BoardCanvas, BoardUI, TestChat, ToolsMenu, ZoomControls, AvatarMenu } from '../../common';

import './RoomPage.scss';

const RoomPage = (): React.ReactElement => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { roomId } = useParams<{ roomId: string }>();
    const { isLoading, isConnected, error } = useSelector((s) => s.connection);
    const password = new URLSearchParams(location.search).get('password') || undefined;

    useEffect(() => {
        if (roomId) dispatch(connectToRoom(roomId, password));
    }, [roomId, password]);

    return (
        <div className="room-page">
            {isConnected && (
                <>
                    <div className="canvas-container">
                        <BoardCanvas />
                        <BoardUI />
                    </div>
                    <div className="ui-container">
                        <div className="tools-container">
                            <ToolsMenu />
                        </div>
                        <div className="chat-container">
                            <TestChat />
                        </div>
                        <div className="zoom-container">
                            <ZoomControls />
                        </div>
                        <div className="avatar-menu-container">
                            <AvatarMenu />
                        </div>
                    </div>
                </>
            )}
            {isLoading && <h1>LOADING</h1>}
            {error && (
                <>
                    <h1>Error: {error}</h1>
                    <button onClick={() => location.reload()}>Try again</button>
                    <button onClick={() => history.goBack()}>Back to Menu</button>
                </>
            )}
        </div>
    );
};

export default RoomPage;
