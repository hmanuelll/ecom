"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "./button";
import { api } from "@/lib/api";
import Link from "next/link";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
  type?: "text" | "products";
  products?: any[];
  timestamp: Date;
};

export function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      role: 'bot', 
      text: 'Hi there! 👋 I am your intelligent shopping assistant. I can help you find products, track your order, or answer questions about our policies. What can I help you with?',
      timestamp: new Date()
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (e?: React.FormEvent, predefinedText?: string) => {
    if (e) e.preventDefault();
    const textToSend = predefinedText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await api.post("/chat", { message: textToSend });
      const data = res.data;
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: data.text,
        type: data.type || "text",
        products: data.products,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: "I'm having trouble connecting to the server right now. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Gaming laptops under 20000",
    "Track my order",
    "Return Policy",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[400px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col h-[500px] sm:h-[600px] animate-in zoom-in-95 origin-bottom-right duration-200">
          
          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-700 p-4 flex justify-between items-center text-white shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold block text-sm">TechStore Assistant</span>
                <span className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors active:scale-90 bg-white/10 p-1.5 rounded-lg hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-slate-950 flex flex-col gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex flex-shrink-0 items-center justify-center mb-1">
                      <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  
                  <div className={`p-3 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' 
                      : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-sm'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    {/* Render Products if any */}
                    {msg.type === 'products' && msg.products && msg.products.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2 w-full sm:w-[260px]">
                        {msg.products.map(product => (
                          <Link href={`/products/${product.id}`} key={product.id} className="block group">
                            <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-2 flex gap-3 hover:border-blue-300 transition-colors">
                              <img 
                                src={`https://via.placeholder.com/150x150.png?text=${encodeURIComponent(product.name)}`} 
                                alt={product.name} 
                                className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600">{product.name}</h4>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
                                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">K{Number(product.price).toFixed(2)}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 mx-8">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-2 max-w-[80%]">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-1">
                  <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length < 3 && !isTyping && (
            <div className="bg-gray-50 dark:bg-slate-950 px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(undefined, sug)}
                  className="flex-shrink-0 bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex gap-2 items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 text-gray-900 dark:text-white dark:placeholder-gray-400 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              size="icon" 
              className="rounded-full w-10 h-10 shrink-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4 -ml-0.5" />
            </Button>
          </form>
        </div>
      )}

      {/* Floating Bubble Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 active:scale-90 focus:outline-none hover:-translate-y-1"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
