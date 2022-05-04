import React, { useState, useRef, useLayoutEffect } from 'react';
import { useSelector } from '../../../hooks';
import webSocket from '../../../services/WebSocket/WebSocket';

import avatarImg from './avatar.png';

import './TestChat.scss';

const TestChat = (): React.ReactElement => {
    const [text, setText] = useState('');
    const { messages } = useSelector((s) => s.chat);
    const { id } = useSelector((s) => s.connection);
    const chatBoxRef = useRef<HTMLUListElement>(null);
    const handleSendMessage = () => {
        setText('');
        webSocket.addChatMessage(text);
    };

    // scroll after change in messages has been rendered
    useLayoutEffect(() => {
        chatBoxRef.current?.scroll({
            top: chatBoxRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    return (
        <div className="test-chat">
            <ul className="chat-box" ref={chatBoxRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`message ${id === message.from && 'own-message'}`}>
                        <div className="avatar">
                            <img src={avatarImg} alt="" />
                        </div>
                        <p className="text">{message.content}</p>
                    </div>
                ))}
            </ul>
            <div className="chat-input">
                <input onChange={({ currentTarget }) => setText(currentTarget.value)} value={text} />
                <button disabled={!text} onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default TestChat;
