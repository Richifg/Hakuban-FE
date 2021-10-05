import React, { useState, useRef, useLayoutEffect } from 'react';

import avatarImg from './avatar.png';
import './TestChat.scss';

interface ITestChat {
    messages: { content: string; from: string }[];
    ownId: string;
    onSendMessage(text: string): void;
}

const TestChat = ({ messages, ownId, onSendMessage }: ITestChat): React.ReactElement => {
    const [text, setText] = useState('');
    const chatBoxRef = useRef<HTMLUListElement>(null);
    const handleSendMessage = () => {
        setText('');
        onSendMessage(text);
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
                    <div key={index} className={`message ${ownId === message.from && 'own-message'}`}>
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
