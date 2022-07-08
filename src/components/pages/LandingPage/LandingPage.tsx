import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { useDispatch, useSelector } from '../../../hooks';
import { createRoom } from '../../../store/slices/connectionSlice';
import { Icon, Carousel, Button, Input, Animation, LoadingScreen } from '../../common';

import styles from './LandingPage.module.scss';

const HomePage = (): React.ReactElement => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [newRoomId, setNewRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { roomId, isLoading } = useSelector((s) => s.connection);

    useEffect(() => {
        if (roomId) {
            history.push(`/room/${roomId}` + (newPassword ? `?password=${newPassword}` : ''));
        }
    }, [roomId]);

    const handleJoinRoom = () => {
        history.push(`/room/${newRoomId}` + (password ? `?password=${password}` : ''));
    };

    const handleCreateRoom = (password?: string) => () => {
        dispatch(createRoom(password));
    };

    return (
        <div className={styles.landingPage}>
            <nav className={styles.navbar}>
                <a href="/" className={styles.link}>
                    <Icon className={styles.logoIcon} name="logo" />
                    <span>Hakuban</span>
                </a>
            </nav>
            <main className={styles.main}>
                <div className={styles.grid}>
                    <h1 className={styles.title}>
                        Online <br></br>
                        <span className={styles.big}>Whiteboard</span>
                    </h1>
                    <div className={styles.animationContainer}>
                        <Animation />
                    </div>
                    <div className={styles.formContainer}>
                        <div className={styles.formContent}>
                            <form className={styles.form}>
                                <h2 className={styles.formTitle}>Create a new board</h2>
                                <Input
                                    className={styles.input}
                                    type="text"
                                    placeholder="Password (optional)"
                                    value={newPassword}
                                    onChange={({ currentTarget }) => setNewPassword(currentTarget.value)}
                                />
                                <Button className={styles.button} onClick={handleCreateRoom(newPassword)} disabled={isLoading}>
                                    Create
                                </Button>
                            </form>
                            <span className={styles.or}>OR</span>
                            <form className={styles.form}>
                                <h2 className={styles.formTitle}>Join a board</h2>
                                <Input
                                    className={styles.input}
                                    type="text"
                                    placeholder="Board #"
                                    value={newRoomId}
                                    onChange={({ currentTarget }) => setNewRoomId(currentTarget.value)}
                                />
                                <Input
                                    className={styles.input}
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={({ currentTarget }) => setPassword(currentTarget.value)}
                                />
                                <Button className={styles.button} onClick={handleJoinRoom} disabled={isLoading}>
                                    Join
                                </Button>
                            </form>
                        </div>
                    </div>
                    <div className={styles.listContainer}>
                        <ul className={styles.featureList}>
                            <li className={styles.feature}>
                                <Icon name="noMoney" />
                                <span className={styles.featureContent}>
                                    <p className={styles.featureTitle}>No sign-up required</p>
                                    <p className={styles.featureDescription}>
                                        Create a new board and start collaborating right away, no account required. *
                                    </p>
                                </span>
                            </li>
                            <li className={styles.feature}>
                                <Icon name="infinite" />
                                <span className={styles.featureContent}>
                                    <p className={styles.featureTitle}>Infinite canvas</p>
                                    <p className={styles.featureDescription}>
                                        Dont let canvas size limit your creativity. Use as much space as you need on this
                                        infinitely growing whiteboard.
                                    </p>
                                </span>
                            </li>
                            <li className={styles.feature}>
                                <Icon name="connect" />
                                <span className={styles.featureContent}>
                                    <p className={styles.featureTitle}>Real-time collaboration</p>
                                    <p className={styles.featureDescription}>
                                        Brainstorming, sketching, wireframing. Hakuban is intuitive tool that lets you and your
                                        team collaborate in real-time from anywhere around the world.
                                    </p>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.carouselContainer}>
                        <div className={styles.carouselContent}>
                            <Carousel />
                        </div>
                    </div>
                    <div className={styles.ctaContainer}>
                        <Button className={styles.cta} onClick={handleCreateRoom()} disabled={isLoading}>
                            Create a new board
                        </Button>
                    </div>
                </div>
            </main>
            <footer className={styles.footer}>
                <Icon name="clock" />
                <p className={styles.footerText}>*Boards are deleted after 24h of creation.</p>
            </footer>
            <LoadingScreen active={isLoading} text="Creating" />
        </div>
    );
};

export default HomePage;
