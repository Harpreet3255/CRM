import { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import api from '../../api/client';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Tono, your AI travel assistant. I can create itineraries, help with client planning, and automate travel tasks. What do you need?",
      timestamp: new Date().toISOString()
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ---------------------------------------------
  // SEND MESSAGE → TONO AUTOMATION ENGINE
  // ---------------------------------------------
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/tono/chat', {
        message: input.trim()
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.reply || "Done!",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

      // If itinerary was generated, append a system message
      if (response.data.itinerary) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `I've added the itinerary to your dashboard and under the client's profile.`,
            timestamp: new Date().toISOString()
          }
        ]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Try again.',
          timestamp: new Date().toISOString(),
          error: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: 'Create trip for a client', prompt: 'Create a 5-day trip to Paris for Rohan starting March 5 with a 1500 CAD budget.' },
    { label: 'Suggest destinations', prompt: 'Suggest destinations for a 7-day romantic vacation under $2000.' },
    { label: 'Analyze a client', prompt: 'Analyze Rohan and suggest the best destinations for him.' },
    { label: 'Regenerate itinerary', prompt: 'Regenerate the last itinerary with more luxury options.' }
  ];

  const handleQuickAction = (prompt) => {
    setInput(prompt);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat reset. What can I help you with?",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Chat with Tono</h2>
            <p className="text-sm text-gray-600">Your AI Travel Assistant</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearChat}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Clear Chat
        </Button>
      </div>

      {/* QUICK ACTIONS */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.prompt)}
                className="justify-start text-left h-auto py-2 px-3"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* CHAT MESSAGES */}
      <Card className="flex-1 overflow-y-auto mb-4 p-4 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.error
                  ? 'bg-red-50 text-red-900 border border-red-200'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
              <div
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-600">Tono is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* INPUT */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Tono to create trips, analyze clients, automate tasks..."
          disabled={loading}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Send
        </Button>
      </div>
    </div>
  );
}
