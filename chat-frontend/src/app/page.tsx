"use client";

import { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import ChatInput from '@/components/ChatInput';
import ChatMessage from '@/components/ChatMessage';
import {OutgoingMessage, SupportedMessage } from '@/types/messages';

export default function Home() {
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [roomId] = useState('main-room');
  const [messages, setMessages] = useState<any[]>([]);
  const [username, setUsername] = useState('');

  const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://localhost:8080`, {
    protocols: ['echo-protocol'],
    onOpen: () => console.log('WebSocket connection established.'),
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === 'ADD_CHAT') {
        setMessages((prev) => [...prev, data.payload]);
      } else if (data.type === 'UPDATE_CHAT') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.chatId === data.payload.chatId
              ? { ...msg, upvotes: data.payload.upvotes }
              : msg
          )
        );
      }
    }
  }, [lastMessage]);

  const handleSendMessage = useCallback((message: string) => {
    const outgoingMessage: OutgoingMessage = {
      type: SupportedMessage.SendMessage,
      payload: {
        userId,
        roomId,
        message,
      },
    };
    sendMessage(JSON.stringify(outgoingMessage));
  }, [sendMessage, userId, roomId]);

  const handleUpvote = useCallback((chatId: string) => {
    const outgoingMessage: OutgoingMessage = {
      type: SupportedMessage.UpvoteMessage,
      payload: {
        userId,
        roomId,
        chatId,
      },
    };
    sendMessage(JSON.stringify(outgoingMessage));
  }, [sendMessage, userId, roomId]);

  const handleJoinRoom = useCallback(() => {
    const outgoingMessage: OutgoingMessage = {
      type: SupportedMessage.JoinRoom,
      payload: {
        userId,
        roomId,
        name: username,
      },
    };
    sendMessage(JSON.stringify(outgoingMessage));
  }, [sendMessage, userId, roomId, username]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Real-time Chat</h1>
        <p className="text-center mb-4">Connection Status: {connectionStatus}</p>
        {!username ? (
          <div className="flex justify-center mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="border p-2 mr-2"
            />
            <button
              onClick={handleJoinRoom}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Join Room
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 space-y-4">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  onUpvote={() => handleUpvote(msg.chatId)}
                />
              ))}
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        )}
      </div>
    }</main>
  );
}