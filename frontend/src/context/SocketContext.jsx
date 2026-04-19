import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect',    () => setConnected(true));
    socketRef.current.on('disconnect', () => setConnected(false));

    return () => socketRef.current?.disconnect();
  }, []);

  const joinRoom = (role) => {
    socketRef.current?.emit('join_room', role);
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, joinRoom }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);