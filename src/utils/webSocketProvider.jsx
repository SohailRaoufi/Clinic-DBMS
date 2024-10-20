<<<<<<< HEAD
// WebSocketContext.js
import React, { createContext, useState, useContext, useCallback } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [websocket, setWebsocket] = useState(null);

  const initializeWebSocket = useCallback(() => {
    if (!websocket) {
      const accessToken = localStorage.getItem("token");
      const ws = new WebSocket(
        `ws://localhost:8000/ws?access_token=${accessToken}`
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
=======
// WebSocketContext.js
import React, { createContext, useState, useContext, useCallback } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [websocket, setWebsocket] = useState(null);

  const initializeWebSocket = useCallback(() => {
    if (!websocket) {
      const accessToken = localStorage.getItem("token");
      const ws = new WebSocket(
        `ws://${import.meta.env.VITE_BACKEND_URL}/ws?access_token=${accessToken}`
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
>>>>>>> b4ee40e5ddd6e5454c942ac3b580a76f0ec221cc
