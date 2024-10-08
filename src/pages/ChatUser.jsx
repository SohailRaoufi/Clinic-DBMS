import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useWebSocket } from "../utils/webSocketProvider";
import "../assets/styles/ChatUser.css";

const ChatInterface = () => {
  const { state } = useLocation();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messageContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const { websocket, initializeWebSocket, closeWebSocket } = useWebSocket();
  const [email] = useState(state?.email || null);
  const wsRef = useRef(null);
  const host = localStorage.getItem("HOST");

  useEffect(() => {
    wsRef.current = initializeWebSocket();

    if (wsRef.current) {
      wsRef.current.onopen = () => {
        console.log("WebSocket connection opened");
        wsRef.current.send(
          JSON.stringify({
            type: "connect",
            email: email,
          })
        );
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "chat_history") {
          setMessages((prevMessages) => [...prevMessages, ...data.messages]);
        } else if (data.type === "new_message") {
          setMessages((prevMessages) => [...prevMessages, data.message]);
        } else if (data.error) {
          console.error("Error:", data.error);
        }
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket connection closed");
      };
    }

    return () => {
      closeWebSocket();
    };
  }, [initializeWebSocket, closeWebSocket, email]);

  const displayMessage = (message) => {
    if (message.type === "text") {
      return (
        <div
          key={message.id}
          className={`flex ${
            message.sender === state?.id ? "justify-start" : "justify-end"
          } mb-2`}
        >
          <div
            className={`p-3 rounded-lg max-w-xs ${
              message.sender === state?.id
                ? "bg-blue-500 text-white"
                : "bg-black text-white"
            }`}
          >
            <Typography variant="body2">{message.text}</Typography>
          </div>
        </div>
      );
    } else if (message.type === "link") {
      const fileLink = message.link.split("/");
      return (
        <div
          key={message.id}
          className={`flex ${
            message.sender === state?.id ? "justify-start" : "justify-end"
          } mb-2`}
        >
          <div
            className={`p-3 rounded-lg max-w-xs ${
              message.sender === state?.id
                ? "bg-green-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            <Typography variant="body2">
              <a
                href={`${host}${message.link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {fileLink[fileLink.length - 1]}
              </a>
            </Typography>
          </div>
        </div>
      );
    }
  };

  const sendMessage = (e) => {
    if (message.trim() && wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          type: "text",
          text: message.trim(),
        })
      );
      setMessage("");
    }
  };

  const sendFile = () => {
    const file = fileInputRef.current.files[0];
    if (file && wsRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result.split(",")[1];
        wsRef.current.send(
          JSON.stringify({
            type: "doc",
            file_data: base64Data,
            file_name: file.name,
          })
        );
      };
      reader.readAsDataURL(file);
      setOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, [messages]);

  return (
    <div className="ChatBox flex h-screen bg-gray-100">
      <Card className="w-full max-w-2xl p-4 bg-white shadow-lg rounded-lg flex flex-col h-full">
        <div className="border-b pb-2 mb-4">
          <Typography variant="h5" color="blue-gray" className="font-semibold">
            Chat with {state?.username}
          </Typography>
        </div>

        <div
          className="messageBox flex-grow overflow-y-auto mb-4"
          ref={messageContainerRef}
        >
          {messages.map((message) => displayMessage(message))}
        </div>

        <div className="chatInput border-t pt-4 flex gap-2 items-center">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            label="Type a message"
            className="flex-grow mr-2"
            onKeyDown={handleKeyPress}
          />
          <Button
            className="sendBtn"
            onClick={sendMessage}
            disabled={!wsRef.current}
          >
            Send
          </Button>
          <PlusIcon
            onClick={handleOpen}
            className="cursor-pointer text-black plusIcon"
            style={{ height: "2rem" }}
          />
        </div>
      </Card>

      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Select Your File
            </Typography>
            <input type="file" ref={fileInputRef} className="ml-2" />
            <Button
              onClick={sendFile}
              className="ml-2"
              disabled={!wsRef.current}
            >
              Send File
            </Button>
          </CardBody>
        </Card>
      </Dialog>
    </div>
  );
};

export default ChatInterface;
