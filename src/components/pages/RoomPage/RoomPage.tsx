import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router';

import { useSelector, useDispatch } from '../../../hooks';
import { connectToRoom, setError } from '../../../store/slices/connectionSlice';
import { BoardCanvas, BoardUI, ToolsMenu, StylesMenu, Chat, ZoomMenu, WelcomeModal } from '../../board';
import { LoadingScreen, ErrorScreen } from '../../common';

import styles from './RoomPage.module.scss';

const RoomPage = (): React.ReactElement => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { roomId } = useParams<{ roomId: string }>();
    const { isLoading, isConnected, error } = useSelector((s) => s.connection);
    const { showWelcomeModal } = useSelector((s) => s.UI);
    const password = new URLSearchParams(location.search).get('password') || undefined;

    useEffect(() => {
        if (roomId) dispatch(connectToRoom(roomId, password));
    }, [roomId, password]);

    const handleErrorClose = () => {
        dispatch(setError(''));
        if (!isConnected) history.push('/');
    };

    return (
        <div className={styles.roomPage}>
            {isConnected && (
                <>
                    <BoardCanvas />
                    <BoardUI />
                    <StylesMenu />
                    <ToolsMenu className={showWelcomeModal ? styles.hiddenLeft : ''} />
                    <ZoomMenu className={showWelcomeModal ? styles.hiddenTop : ''} />
                    <Chat className={showWelcomeModal ? styles.hiddenRight : ''} />
                    {showWelcomeModal && <WelcomeModal />}
                </>
            )}
            <LoadingScreen active={isLoading} closeDelay={1500} />
            <ErrorScreen text={error} onTryAgain={() => location.reload()} onClose={handleErrorClose} />
        </div>
    );
};

export default RoomPage;
