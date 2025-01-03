// WebSocketContext.js
import { createContext, useState, useContext, useCallback } from 'react';

import PropTypes from 'prop-types';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [websocket, setWebsocket] = useState(null);

  const initializeWebSocket = useCallback(() => {
    if (!websocket) {
      const accessToken = localStorage.getItem('token');
      const ws = new WebSocket(
        `ws://${import.meta.env.VITE_BACKEND_URL}ws?access_token=${accessToken}`
      );
      setWebsocket(ws);
    }
    return websocket;
  }, [websocket]);

  const closeWebSocket = useCallback(() => {
    if (websocket) {
      websocket.close();
      setWebsocket(null);
    }
  }, [websocket]);

  return (
    <WebSocketContext.Provider
      value={{ websocket, initializeWebSocket, closeWebSocket }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
