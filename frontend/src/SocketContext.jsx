import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('https://basic-video-calling-mern-webrtc-backend.vercel.app', {
            transports: ['websocket'], // Explicitly enable WebSocket transport
        });

        setSocket(newSocket);

        // Clean up the socket connection when component unmounts
        return () => {
            newSocket.close();
        };
    }, []);

    // Ensure that the SocketContext.Provider provides the socket value to its children
    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
