import React, { useState, useRef, useMemo, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from '../../../hooks';
import { setShowChat } from '../../../store/slices/UISlice';
import { MenuContainer, Icon } from '../../common';
import webSocket from '../../../services/WebSocket/WebSocket';

import styles from './Chat.module.scss';

const Chat = (): React.ReactElement => {
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const { users, ownUser } = useSelector((s) => s.users);
    const { showChat } = useSelector((s) => s.UI);
    const { messages } = useSelector((s) => s.chat);
    const chatBoxRef = useRef<HTMLOListElement>(null);

    const sortedMessages = useMemo(() => [...messages].sort((a, b) => (a.creationDate > b.creationDate ? 1 : -1)), [messages]);

    // scroll after change in messages has been rendered
    useLayoutEffect(() => {
        chatBoxRef.current?.scroll({
            top: chatBoxRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        setText(value);
    };

    const handleSendMessage = () => {
        setText('');
        webSocket.addChatMessage(text);
    };

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    return (
        <MenuContainer className={`${styles.chatMenu} ${showChat ? styles.show : ''}`}>
            <button className={`${styles.button} ${styles.maximizeButton}`} onClick={() => dispatch(setShowChat(true))}>
                <Icon name="bubble" />
            </button>
            <div className={styles.chatContainer}>
                <button className={`${styles.button} ${styles.minimizeButton}`} onClick={() => dispatch(setShowChat(false))}>
                    <Icon name="arrowNone" />
                </button>
                <ol className={styles.messageArea} ref={chatBoxRef}>
                    {sortedMessages.map(({ fromId, fromUsername, content }, index) => {
                        const user = users?.[fromId];
                        return (
                            <li
                                key={index}
                                className={`${styles.messageContainer} ${ownUser?.id === fromId ? styles.ownMessage : ''} ${
                                    index > 0 && sortedMessages[index - 1].fromId === fromId ? styles.sameUser : ''
                                }`}
                            >
                                <p className={styles.username} style={{ color: user?.color || '$color-background-contrast' }}>
                                    {user?.username || fromUsername}
                                </p>
                                <p className={styles.message}>{content}</p>
                            </li>
                        );
                    })}
                </ol>
                <div className={styles.inputArea}>
                    <input
                        type="text"
                        className={styles.input}
                        onChange={handleChange}
                        value={text}
                        onKeyPress={handleKey}
                        placeholder="Type here"
                    />
                    <button className={styles.button} onClick={handleSendMessage} disabled={!text}>
                        <Icon name="send" />
                    </button>
                </div>
            </div>
        </MenuContainer>
    );
};

export default Chat;
