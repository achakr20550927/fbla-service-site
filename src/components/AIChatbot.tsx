import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Shield, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                    'HTTP-Referer': 'https://silencetheviolenceec.com',
                    'X-Title': 'Silence the Violence Assistant',
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a helpful, empathetic, and knowledgeable assistant for "Silence the Violence", a Maryland-based gun violence prevention initiative. 
              Your goals:
              1. Provide accurate information about firearm safety and prevention.
              2. Discuss Maryland-specific gun violence data (refer to the dashboard data).
              3. Help users find local resources (crisis centers, mental health support, secure storage).
              4. Maintain a professional, supportive, and non-political tone.
              5. If a user is in immediate danger or a crisis, strongly advise them to call 988 or 911.
              Keep responses concise and well-formatted. Use bullet points where appropriate.`,
                        },
                        ...messages.map((m) => ({ role: m.role, content: m.content })),
                        { role: 'user', content: input },
                    ],
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', response.status, errorData);
                throw new Error(`API returned ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
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
            console.error('Chatbot error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `Account Sync: ${error.message || 'Connecting to secure server...'} Please verify your keys and network.`,
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button with Pulse Effect */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl hidden sm:block"
                        >
                            <p className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                                Ask about safety 👋
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-[0_20px_40px_rgba(234,88,12,0.3)] transition-all duration-500 group ${isOpen ? 'bg-slate-900 rotate-90' : 'bg-orange-600'
                        }`}
                >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity" />
                    {isOpen ? (
                        <X className="w-7 h-7" />
                    ) : (
                        <div className="relative">
                            <MessageSquare className="w-7 h-7" />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-orange-600"
                            />
                        </div>
                    )}
                </motion.button>
            </div>

            {/* Main Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(10px)' }}
                        className="fixed bottom-28 right-6 z-[9998] w-[92vw] sm:w-[420px] h-[650px] max-h-[75vh] glass-card flex flex-col overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 rounded-[40px]"
                    >
                        {/* Header: Premium Glassmorphism */}
                        <div className="relative p-8 bg-slate-950/40 backdrop-blur-3xl border-b border-white/5 overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Shield className="w-20 h-20 text-orange-600 rotate-12" />
                            </div>

                            <div className="flex items-center gap-5 relative z-10">
                                <div className="relative">
                                    <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-950/50">
                                        <Bot className="w-8 h-8 text-black" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-950 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none mb-1">
                                        STV Assistant
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-3 h-3 text-orange-500" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            Maryland Data Expert
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content: Smooth Scrolling Messages */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 bg-slate-950/20">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10, x: message.role === 'user' ? 10 : -10 }}
                                    animate={{ opacity: 1, y: 0, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors ${message.role === 'user' ? 'bg-orange-600 shadow-lg shadow-orange-950/50' : 'bg-white/10 border border-white/10'
                                            }`}>
                                            {message.role === 'user' ? (
                                                <User className="w-4 h-4 text-black" />
                                            ) : (
                                                <Bot className="w-4 h-4 text-orange-500" />
                                            )}
                                        </div>

                                        <div className={`p-5 rounded-3xl text-[13px] leading-[1.6] shadow-xl ${message.role === 'user'
                                            ? 'bg-orange-600 text-black font-bold rounded-tr-none'
                                            : 'bg-white/95 backdrop-blur-md text-slate-950 font-medium rounded-tl-none border border-white/50'
                                            }`}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-extrabold" {...props} />,
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start items-center gap-3"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-orange-500 animate-pulse" />
                                    </div>
                                    <div className="flex gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                                className="w-1.5 h-1.5 bg-orange-600 rounded-full"
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Footer: Sleek and Minimal */}
                        <div className="p-8 pb-10 bg-slate-950/60 backdrop-blur-3xl border-t border-white/5">
                            <form onSubmit={handleSend} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-[24px] pl-6 pr-16 py-5 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-600/50 focus:border-orange-600 transition-all shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-3 w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-black hover:bg-orange-500 disabled:opacity-30 disabled:hover:bg-orange-600 transition-all duration-300 shadow-lg"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>

                            <div className="mt-4 flex items-center justify-center gap-2 opacity-30">
                                <Info className="w-3 h-3 text-white" />
                                <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">
                                    Encrypted & Secure AI
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
