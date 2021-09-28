import React from 'react';

import { ChatMessage } from '../../common/interfaces';
import avatarImg from './avatar.png';
import './TestChat.scss';

interface ITestChat {
    messages: ChatMessage[];
    ownId: string;
}

const TestChat = ({ messages, ownId }: ITestChat): React.ReactElement => (
    <div className="test-chat">
        <ul className="messages">
            {messages.map((message, index) => (
                <div key={index} className={`message ${ownId === message.from && 'own-message'}`}>
                    <div className="avatar">
                        <img src={avatarImg} alt="" />
                    </div>
                    <p className="text">{message.content}</p>
                </div>
            ))}
        </ul>
    </div>
);

export default TestChat;
