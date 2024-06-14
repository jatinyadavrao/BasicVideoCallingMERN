
import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();


export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('https://basic-video-calling-mern-webrtc-backend.vercel.app/');
        setSocket(newSocket);
        console.log('newSocket')

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    );
};
