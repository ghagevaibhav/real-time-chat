import React from 'react';

interface ChatMessageProps {
  message: {
    name: string;
    message: string;
    upvotes: number;
  };
  onUpvote: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onUpvote }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">{message.name}</span>
        <button
          onClick={onUpvote}
          className="bg-gray-200 px-2 py-1 rounded text-sm"
        >
          ▲ {message.upvotes}
        </button>
      </div>
      <p>{message.message}</p>
    </div>
  );
};

export default ChatMessage;