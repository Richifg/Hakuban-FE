import React, { useEffect, useState } from 'react';

import { Item, Chat, WSMessage } from '../../common/interfaces';
import { TestChat } from '..';

const url = process.env.REACT_APP_SERVER_URL;

interface ITestConnection {
    roomId: string;
}

const TestConnection = ({ roomId }: ITestConnection): React.ReactElement => {
    const [items, setItems] = useState<Item[]>([]);
    const [socket, setSocket] = useState<WebSocket>();
    const [id, setId] = useState('test');

    // TODO: should not send messages if id has not been set
    const handleSendMessage = (text: string) => {
        const message: WSMessage = {
            type: 'item',
            content: {
                type: 'chat',
                content: text,
                from: id,
            },
        };
        socket?.send(JSON.stringify(message));
    };

    // initiate webSocket connection
    useEffect(() => {
        const socket = new WebSocket(`${url}?roomId=${roomId}`);
        setSocket(socket);
        socket.addEventListener('open', (event) => {
            console.log('opened!', event);
        });
        socket.addEventListener('error', (event) => {
            console.log('error!', event);
        });
        socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data) as WSMessage;
            console.log('received message!', message);
            switch (message.type) {
                case 'error':
                    console.log(`Error: ${message.content}`);
                    break;
                case 'item':
                    setItems((oldItems) => [...oldItems, message.content]);
                    break;
                case 'collection':
                    setItems((oldItems) => [...oldItems, ...message.content]);
                    break;
                case 'id':
                    setId(message.content);
                    break;
            }
        });
    }, [roomId]);

    // TODO: Why isn't typescript narrowing type to Chat on its own???
    const chatMessages = items.filter((item) => item.type === 'chat') as Chat[];
    return (
        <div className="test-connection">
            <TestChat messages={chatMessages} ownId={id} onSendMessage={handleSendMessage} />
        </div>
    );
};

export default TestConnection;
