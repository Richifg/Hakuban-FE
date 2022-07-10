import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../../hooks';
import { setShowWelcomeModal } from '../../../store/slices/UISlice';
import { WSService } from '../../../services';
import { userAnimals } from '../../../constants';
import { Icon, Button, Input } from '../../common';

import styles from './WelcomeModal.module.scss';

const WelcomeModal = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { ownUser, isLoading } = useSelector((s) => s.users);
    const { showShareLink } = useSelector((s) => s.UI);
    const { roomId } = useSelector((s) => s.connection);
    const [username, setUsername] = useState(ownUser?.username || '');
    const [waitingConfirm, setWaitingConfirm] = useState(false);

    useEffect(() => {
        let id: NodeJS.Timeout;
        if (!isLoading && waitingConfirm) {
            id = setTimeout(() => dispatch(setShowWelcomeModal(false)), 500);
        }
        return () => clearTimeout(id);
    }, [isLoading, waitingConfirm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        setUsername(value);
    };

    const handleRandom = () => {
        const randomAnimal = userAnimals[Math.floor(Math.random() * userAnimals.length)];
        setUsername(`Anonymous ${randomAnimal}`);
    };

    const handleCopy = (text: string) => () => {
        navigator.clipboard.writeText(text);
    };

    const handleEnter = () => {
        if (ownUser) {
            WSService.updateUser({ ...ownUser, username });
            setWaitingConfirm(true);
        }
    };

    return (
        <div className={`${styles.welcomeModal} ${waitingConfirm && !isLoading ? styles.animate : ''}`}>
            <div className={styles.container}>
                <span className={styles.header}>
                    <h1 className={styles.title}>Welcome!</h1>
                    <Icon className={styles.logo} name="logo" />
                </span>
                <span className={styles.content}>
                    <p className={styles.subtitle}>Choose a username</p>
                    <span className={styles.inputContainer}>
                        <button type="button" className={styles.randomButton} onClick={handleRandom}>
                            <Icon name="dice" />
                        </button>
                        <Input type="text" value={username} onChange={handleChange} />
                    </span>

                    {showShareLink && (
                        <>
                            <p className={styles.subtitle}>Room ID:</p>
                            <span className={styles.inputContainer}>
                                <button type="button" onClick={handleCopy(roomId)}>
                                    <Icon name="copy" className={styles.copyButton} />
                                </button>
                                <p className={styles.roomId}>{roomId}</p>
                            </span>

                            <p className={styles.subtitle}>Share link:</p>
                            <span className={styles.inputContainer}>
                                <button type="button" onClick={handleCopy(location.href)}>
                                    <Icon name="copy" className={styles.copyButton} />
                                </button>
                                <Input value={location.href} />
                            </span>
                        </>
                    )}
                    <Button className={styles.enterButton} disabled={isLoading || !ownUser || !username} onClick={handleEnter}>
                        Enter
                    </Button>
                </span>
            </div>
        </div>
    );
};

export default WelcomeModal;
