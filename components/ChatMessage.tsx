import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { BOT_PLACEHOLDER_AVATAR, USER_PLACEHOLDER_AVATAR, BOT_NAME } from '../constants';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  // Basic markdown-like link detection and replacement
  const formatText = (text: string): React.ReactNode => {
    // Replace newlines with <br />
    const textWithBreaks = text.split('\n').map((line, index, arr) => (
      <React.Fragment key={index}>
        {line}
        {index < arr.length - 1 && <br />}
      </React.Fragment>
    ));
    return textWithBreaks;
  };


  return (
    <div className={`flex items-end mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <img 
          src={BOT_PLACEHOLDER_AVATAR} 
          alt={BOT_NAME} 
          className="w-8 h-8 rounded-full mr-3 flex-shrink-0" 
        />
      )}
      <div 
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl px-4 py-3 rounded-xl shadow-md ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-white text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{formatText(message.text)}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-blue-200 text-right' : 'text-gray-400 text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUser && (
         <img 
          src={USER_PLACEHOLDER_AVATAR} 
          alt="User" 
          className="w-8 h-8 rounded-full ml-3 flex-shrink-0"
        />
      )}
    </div>
  );
};

export default ChatMessage;
