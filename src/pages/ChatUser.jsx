// src/components/ChatInterface.jsx
import React, { useState } from "react";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import "../assets/styles/ChatUser.css";

// Dummy messages
const initialMessages = [
  { id: 1, text: "Hello, how are you?", sender: "John Doe" },
  { id: 2, text: "I'm doing great, thanks! How about you?", sender: "Me" },
];

const ChatInterface = ({ userName }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: "Me" },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="ChatBox flex h-screen bg-gray-100">
      <Card className="w-full max-w-2xl p-4 bg-white shadow-lg rounded-lg flex flex-col h-full">
        <div className="border-b pb-2 mb-4">
          <Typography variant="h5" color="blue-gray" className="font-semibold">
            Chat with {userName}
          </Typography>
        </div>

        <div className="messageBox flex-grow overflow-y-auto mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "Me" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  message.sender === "Me"
                    ? "bg-black text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                <Typography variant="body2">{message.text}</Typography>
              </div>
            </div>
          ))}
        </div>

        <div className="chatInput border-t pt-4 flex gap-2 items-center">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            label="Type a message"
            className="flex-grow mr-2"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} className="ml-2">
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;
