import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const AIChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your Silence the Violence assistant. How can I help you today with firearm safety, Maryland-specific data, or finding local resources?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a helpful, empathetic, and knowledgeable assistant for "Silence the Violence", a Maryland-based gun violence prevention initiative. 
              Your goals:
              1. Provide accurate information about firearm safety and prevention.
              2. Discuss Maryland-specific gun violence data (if asked, refer to the dashboard data).
              3. Help users find local resources (crisis centers, mental health support, secure storage).
              4. Maintain a professional, supportive, and non-political tone.
              5. If a user is in immediate danger or a crisis, strongly advise them to call 988 (Substance Abuse and Mental Health Services Administration) or 911.
              Keep responses concise and well-formatted.`,
                        },
                        ...messages.map((m) => ({ role: m.role, content: m.content })),
                        { role: 'user', content: input },
                    ],
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('OpenAI API Error:', response.status, errorData);
                throw new Error(`OpenAI API returned ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.choices[0].message.content,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('Chatbot error details:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `Connection Error: ${error.message || 'I encountered an unexpected issue.'} Please verify your API key and network connection.`,
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(234,88,12,0.4)] hover:bg-orange-500 transition-colors border border-white/20"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                        className="fixed bottom-24 right-6 z-[9998] w-[90vw] sm:w-[400px] h-[600px] max-h-[70vh] glass-card flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/10"
                    >
                        {/* Header */}
                        <div className="p-6 bg-slate-900 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Safety Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Intelligence</span>
                                    </div>
                                </div>
                            </div>
                            <Sparkles className="w-4 h-4 text-orange-500/50" />
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${message.role === 'user' ? 'bg-slate-800' : 'bg-orange-600/20 text-orange-600'
                                            }`}>
                                            {message.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div
                                            className={`p-4 rounded-2xl text-xs font-medium leading-relaxed ${message.role === 'user'
                                                ? 'bg-orange-600 text-white shadow-lg'
                                                : 'bg-white/5 border border-white/10 text-slate-300'
                                                }`}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 text-orange-600 animate-spin" />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Processing...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-6 bg-slate-900/50 border-t border-white/10 flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-600 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 transition-colors shadow-lg"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
