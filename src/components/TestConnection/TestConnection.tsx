import React, { useEffect, useState } from 'react';

import { ChatMessage, WSMessage, Item } from '../../common/interfaces';
import { TestChat } from '..';

const url = process.env.REACT_APP_SERVER_URL;

interface ITestConnection {
    roomId: string;
}

const TestConnection = ({ roomId }: ITestConnection): React.ReactElement => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [socket, setSocket] = useState<WebSocket>();

    const handleSendMessage = (text: string) => {
        const message: WSMessage = {
            type: 'item',
            item: {
                itemType: 'text',
                content: text,
                coordinates: '0,0',
                from: 'me',
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
            if (message.type === 'error') console.log(`Error: ${message.error}`);
            else if (message.type === 'item') {
                const item = message.item as Item;
                // eslint-disable-next-line max-len
                setMessages((oldMessages) => [...oldMessages, { from: item.from, content: item.content }]);
            } else {
                const items = (message.items as Item[]).map((item) => ({ from: item.from, content: item.content }));
                setMessages((oldMessages) => [...oldMessages, ...items]);
            }
        });
    }, [roomId]);

    return (
        <div className="test-connection">
            <TestChat messages={messages} ownId="me" onSendMessage={handleSendMessage} />
        </div>
    );
};

export default TestConnection;
