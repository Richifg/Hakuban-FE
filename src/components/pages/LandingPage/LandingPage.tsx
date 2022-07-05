import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { useDispatch, useSelector } from '../../../hooks';
import { createRoom } from '../../../store/slices/connectionSlice';
import { Icon, PageWrapper, Carousel, Button, Input } from '../../common';

import styles from './LandingPage.module.scss';

const HomePage = (): React.ReactElement => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [newRoomId, setNewRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
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
        <PageWrapper wrapperClassName={styles.landingPage} contentClassName={styles.landingPageContent}>
            <nav className={styles.navbar}>
                <a href="/" className={styles.link}>
                    <Icon className={styles.logoIcon} name="logo" />
                    <span>Hakuban</span>
                </a>
            </nav>
            <main className={styles.main}>
                <Icon className={styles.backgroundLogo} name="logo" />
                <div className={styles.col}>
                    <h1 className={styles.title1}>
                        Online <br></br>
                        <span className={styles.big}>Whiteboard</span>
                    </h1>
                    <div className={styles.carouselContainer}>
                        <Carousel />
                    </div>
                    <p className={styles.subtitle1}>No sign-up required!</p>
                    <p>Boards are deleted after 24h</p>
                </div>
                <div className={styles.col}>
                    <div className={styles.formContainer}>
                        <form className={styles.form}>
                            <h2 className={styles.title2}>Create a new board</h2>
                            <Input className={styles.input} type="text" placeholder="Password (optional)" />
                            <Button className={styles.button}>Create</Button>
                        </form>
                        <form className={styles.form}>
                            <h2 className={styles.title2}>Join a board</h2>
                            <Input className={styles.input} type="text" placeholder="Board #" />
                            <Input className={styles.input} type="password" placeholder="Password" />
                            <Button className={styles.button}>Join</Button>
                        </form>
                    </div>
                </div>
            </main>
        </PageWrapper>
    );
};

export default HomePage;
