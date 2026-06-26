import { useState, useEffect } from 'react';
import { ChatWorkspace } from '../components/chat/ChatWorkspace/ChatWorkspace';
import type { Conversation, Message, ModelConfig } from '../types';
import type { ModelItem } from '../types';
import { sendChatMessage } from '../services/chatService';
import { getModels } from '../services/ModelsMetaData';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const stored = localStorage.getItem('orbit_conversations');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const stored = localStorage.getItem('orbit_active_chat_id');
    if (stored) return stored;
    
    const storedConvos = localStorage.getItem('orbit_conversations');
    if (storedConvos) {
       const parsed = JSON.parse(storedConvos);
       if (parsed.length > 0) return parsed[0].id;
    }
    return null;
  });
  
  const [inputValue, setInputValue] = useState(() => {
    return localStorage.getItem('orbit_chat_input') || '';
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<ModelItem[]>([]);
  
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem('orbit_chat_model') || '';
  });
  
  const [config, setConfig] = useState<ModelConfig>(() => {
    const stored = localStorage.getItem('orbit_chat_config');
    return stored ? JSON.parse(stored) : {
      temperature: 0.7,
      top_p: 0.9,
      num_predict: 2048,
      num_ctx: 8192,
    };
  });

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('orbit_conversations', JSON.stringify(conversations));
    } else {
      localStorage.removeItem('orbit_conversations');
    }
  }, [conversations]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem('orbit_active_chat_id', activeChatId);
    } else {
      localStorage.removeItem('orbit_active_chat_id');
    }
  }, [activeChatId]);

  useEffect(() => {
    localStorage.setItem('orbit_chat_input', inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (selectedModel) {
      localStorage.setItem('orbit_chat_model', selectedModel);
    }
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('orbit_chat_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    async function fetchModels() {
      try {
        const data = await getModels();
        setModels(data.models);
        setSelectedModel((prev) => prev || (data.models[0]?.model ?? ''));
      } catch (error) {
        console.log(error);
      }
    }
    fetchModels();
  }, []);

  const activeChat = conversations.find((c) => c.id === activeChatId) || null;

  const handleNewChat = () => {
    setActiveChatId(null);
    setInputValue('');
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);

    if (activeChatId === id) {
      setActiveChatId(updated.length > 0 ? updated[0].id : null);
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

    if (!currentChat) {
      const generatedTitle = text.length > 30 ? `${text.substring(0, 30)}...` : text;
      currentChat = {
        id: Date.now().toString(),
        title: generatedTitle,
        messages: [newUserMessage],
        createdAt: Date.now(),
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
      const assistantMessage: Message = { role: 'assistant', content: '' };

      currentChat.messages = [...currentChat.messages, assistantMessage];
      updatedConversations = updatedConversations.map((chat) =>
        chat.id === currentChat!.id ? { ...chat, messages: currentChat!.messages } : chat,
      );
      setConversations([...updatedConversations]);

      const { metrics } = await sendChatMessage(
        selectedModel,
        requestMessages,
        (chunk) => {
          assistantMessage.content += chunk;

          updatedConversations = updatedConversations.map((chat) =>
            chat.id === currentChat!.id
              ? {
                  ...chat,
                  messages: chat.messages.map((message, index) =>
                    index === chat.messages.length - 1
                      ? { ...message, content: assistantMessage.content }
                      : message,
                  ),
                }
              : chat,
          );

          setConversations([...updatedConversations]);
        },
        config
      );

      // Final update with metrics
      if (metrics) {
        assistantMessage.metrics = metrics;
        updatedConversations = updatedConversations.map((chat) =>
          chat.id === currentChat!.id
            ? {
                ...chat,
                messages: chat.messages.map((message, index) =>
                  index === chat.messages.length - 1
                    ? { ...message, metrics }
                    : message,
                ),
              }
            : chat,
        );
        setConversations([...updatedConversations]);
      }
    } catch (error) {
      console.error('Chat API error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `⚠️ **Connection Error**: Unable to contact the local AI engine. Please ensure your backend server is running on port 5000 and Ollama is active.\n\nDetails:\n\`\`\`text\n${error instanceof Error ? error.message : String(error)}\n\`\`\``,
      };

      updatedConversations = updatedConversations.map((chat) =>
        chat.id === currentChat!.id
          ? {
              ...chat,
              messages: chat.messages.map((message, index) =>
                index === chat.messages.length - 1 ? errorMessage : message,
              ),
            }
          : chat,
      );

      setConversations([...updatedConversations]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatWorkspace
      conversations={conversations}
      activeChatId={activeChatId}
      activeChat={activeChat}
      inputValue={inputValue}
      setInputValue={setInputValue}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      onSelectChat={setActiveChatId}
      onDeleteChat={handleDeleteChat}
      onNewChat={handleNewChat}
      models={models}
      selectedModel={selectedModel}
      setSelectedModel={setSelectedModel}
      config={config}
      setConfig={setConfig}
    />
  );
}
