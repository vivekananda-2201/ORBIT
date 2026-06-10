import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import type { Conversation, Message } from './types';
import { sendChatMessage } from './services/chatService';
import './App.css';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('orbit_conversations');
      if (stored) {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveChatId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load chats from localStorage", e);
    }
  }, []);

  // Save conversations to local storage when they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('orbit_conversations', JSON.stringify(conversations));
    } else {
      localStorage.removeItem('orbit_conversations');
    }
  }, [conversations]);

  const activeChat = conversations.find(c => c.id === activeChatId) || null;

  const handleNewChat = () => {
    setActiveChatId(null);
    setInputValue('');
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    
    if (activeChatId === id) {
      if (updated.length > 0) {
        setActiveChatId(updated[0].id);
      } else {
        setActiveChatId(null);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    if (!textToSend) {
      setInputValue('');
    }

    setIsLoading(true);

    const newUserMessage: Message = { role: 'user', content: text };
    
    let currentChat = activeChat;
    let updatedConversations = [...conversations];

    // Create a new conversation session if we are in the default empty/new state
    if (!currentChat) {
      const generatedTitle = text.length > 30 ? text.substring(0, 30) + '...' : text;
      currentChat = {
        id: Date.now().toString(),
        title: generatedTitle,
        messages: [newUserMessage],
        createdAt: Date.now()
      };
      updatedConversations = [currentChat, ...updatedConversations];
      setConversations(updatedConversations);
      setActiveChatId(currentChat.id);
    } else {
      currentChat.messages = [...currentChat.messages, newUserMessage];
      setConversations(updatedConversations);
    }

    try {
      const requestMessages = [...currentChat.messages];
      const assistantMessage: Message = {
        role: 'assistant',
        content: ''
      };

      currentChat.messages = [...currentChat.messages, assistantMessage];
      updatedConversations = updatedConversations.map(chat =>
        chat.id === currentChat.id
          ? { ...chat, messages: currentChat.messages }
          : chat
      );
      setConversations([...updatedConversations]);

      await sendChatMessage(requestMessages, (chunk) => {
        assistantMessage.content += chunk;

        updatedConversations = updatedConversations.map(chat =>
          chat.id === currentChat.id
            ? {
                ...chat,
                messages: chat.messages.map((message, index) =>
                  index === chat.messages.length - 1
                    ? { ...message, content: assistantMessage.content }
                    : message
                )
              }
            : chat
        );

        setConversations([...updatedConversations]);
      });
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `⚠️ **Connection Error**: Unable to contact the local AI engine. Please ensure your backend server is running on port 5000 and Ollama is active.\n\nDetails:\n\`\`\`text\n${error instanceof Error ? error.message : String(error)}\n\`\`\``
      };

      currentChat.messages = currentChat.messages.map((message, index) =>
        index === currentChat.messages.length - 1 ? errorMessage : message
      );
      updatedConversations = updatedConversations.map(chat =>
        chat.id === currentChat.id
          ? {
              ...chat,
              messages: chat.messages.map((message, index) =>
                index === chat.messages.length - 1 ? errorMessage : message
              )
            }
          : chat
      );

      setConversations([...updatedConversations]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        conversations={conversations}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
      />
      <ChatArea
        activeChat={activeChat}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onNewChat={handleNewChat}
      />
    </div>
  );
}
