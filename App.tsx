import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage as ChatMessageType } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { initChatSession, sendMessageToBot } from './services/geminiService';
import { BOT_NAME, INITIAL_BOT_MESSAGES, UI_TEXT, LanguageCode, SUPPORTED_LANGUAGES } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = useCallback(async (currentLang: LanguageCode) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!process.env.API_KEY) {
        console.error("API_KEY is not configured. Please set the API_KEY environment variable.");
        setError(UI_TEXT[currentLang].configErrorApiKeyMissingUserFriendly);
        setIsLoading(false);
        setMessages([{
          id: crypto.randomUUID(),
          text: UI_TEXT[currentLang].configErrorBotMessage,
          sender: 'bot',
          timestamp: new Date(),
        }]);
        return;
      }
      const session = await initChatSession();
      setChatSession(session);
      setMessages([{
        id: crypto.randomUUID(),
        text: INITIAL_BOT_MESSAGES[currentLang],
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } catch (e) {
      console.error("Failed to initialize chat session:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during initialization.";
      setError(UI_TEXT[currentLang].chatInitializationErrorUserFriendly(errorMessage));
       setMessages([{
        id: crypto.randomUUID(),
        text: UI_TEXT[currentLang].chatInitializationErrorBotMessage(errorMessage),
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array, currentLang will be passed on first call

  useEffect(() => {
    initializeChat(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount, with initial language

  const handleSendMessage = async (text: string) => {
    if (!chatSession) {
      setError("Chat session is not initialized. Please wait or refresh."); // This error is less common now but good to keep
       setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), text, sender: 'user', timestamp: new Date() },
        { id: crypto.randomUUID(), text: UI_TEXT[language].sendMessageErrorBotMessage, sender: 'bot', timestamp: new Date() }
      ]);
      return;
    }

    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const botResponseText = await sendMessageToBot(chatSession, text);
      const botMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (e) {
      const errorMessageText = e instanceof Error ? e.message : "An unknown error occurred.";
      console.error("Error processing message:", e);
      // No need to call setError here as the bot message itself indicates an error.
      // setError(UI_TEXT[language].botErrorProcessingMessage(errorMessageText)); 
      const errorBotMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        text: UI_TEXT[language].botErrorProcessingMessage(errorMessageText),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'es' : 'en');
    // Note: This does not re-initialize the chat or change the language of existing messages.
    // It primarily affects new UI text elements like placeholders.
    // The initial bot message language is set at component mount.
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-slate-100 to-sky-100">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold">{UI_TEXT[language].headerTitle}</h1>
        <button 
          onClick={toggleLanguage} 
          className="text-sm font-medium py-2 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
          aria-label={language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
        >
          {UI_TEXT[language].languageSwitchButtonLabel(language)}
        </button>
      </header>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-2 rounded-md" role="alert">
          <p className="font-bold">{UI_TEXT[language].errorTitle}</p>
          <p>{error}</p>
        </div>
      )}

      <main className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} /> {/* For scrolling to bottom */}
      </main>

      {isLoading && messages.length > 0 && messages[messages.length -1].sender === 'user' && (
         <div className="px-4 py-2 text-sm text-gray-500 italic">
          {UI_TEXT[language].typingIndicator(BOT_NAME)}
        </div>
      )}
      
      <div className="sticky bottom-0">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading && chatSession !== null} 
          language={language}
        />
      </div>
    </div>
  );
};

export default App;