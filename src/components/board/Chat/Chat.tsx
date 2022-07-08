import React, { useState, useRef, useMemo, useLayoutEffect, Fragment } from 'react';
import { useSelector, useDispatch } from '../../../hooks';
import { setShowChat } from '../../../store/slices/UISlice';
import { MenuContainer, Icon, Input } from '../../common';
import webSocket from '../../../services/WebSocket/WebSocket';

import styles from './Chat.module.scss';
import { resetUnreadMessages, setLastReadMessageId } from '../../../store/slices/chatSlice';

interface Chat {
    className?: string;
}

const Chat = ({ className = '' }: Chat): React.ReactElement => {
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const { users, ownUser } = useSelector((s) => s.users);
    const { unreadMessageCount, lastReadMessageId } = useSelector((s) => s.chat);
    const { showChat } = useSelector((s) => s.UI);
    const { messages } = useSelector((s) => s.chat);
    const chatBoxRef = useRef<HTMLOListElement>(null);

    const sortedMessages = useMemo(() => [...messages].sort((a, b) => (a.creationDate > b.creationDate ? 1 : -1)), [messages]);

    // scroll after change in messages has been rendered
    useLayoutEffect(() => {
        if (showChat) {
            chatBoxRef.current?.scroll({
                top: chatBoxRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, showChat]);

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

    const handleOpenChat = () => {
        dispatch(setShowChat(true));
        dispatch(resetUnreadMessages());
    };

    const handleCloseChat = () => {
        dispatch(setShowChat(false));
        dispatch(setLastReadMessageId(sortedMessages[sortedMessages.length - 1].id));
    };

    return (
        <MenuContainer className={`${styles.chatMenu} ${showChat ? styles.show : ''} ${className}`}>
            {unreadMessageCount > 0 && <div className={styles.unreadCounter}>{unreadMessageCount}</div>}
            <button className={`${styles.button} ${styles.maximizeButton}`} onClick={handleOpenChat}>
                <Icon name="bubble" />
            </button>
            <div className={styles.chatContainer}>
                <button className={`${styles.button} ${styles.minimizeButton}`} onClick={handleCloseChat}>
                    <Icon name="arrowNone" />
                </button>
                <ol className={styles.messageArea} ref={chatBoxRef}>
                    {sortedMessages.map(({ id, fromId, fromUsername, content }, index) => {
                        const user = users?.[fromId];
                        const isLastRead = lastReadMessageId === id && index !== sortedMessages.length - 1;
                        const isSameUser = index > 0 && sortedMessages[index - 1].fromId === fromId;
                        return (
                            <Fragment key={id}>
                                <li
                                    className={`${styles.messageContainer} ${ownUser?.id === fromId ? styles.ownMessage : ''} ${
                                        isSameUser ? styles.sameUser : ''
                                    }`}
                                >
                                    <p className={styles.username} style={{ color: user?.color || '$color-background-contrast' }}>
                                        {user?.username || fromUsername}
                                    </p>
                                    <p className={styles.message}>{content}</p>
                                </li>
                                {isLastRead && <span className={styles.lastMsgSeparator}>---Last read message----</span>}
                            </Fragment>
                        );
                    })}
                </ol>
                <div className={styles.inputArea}>
                    <Input
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
