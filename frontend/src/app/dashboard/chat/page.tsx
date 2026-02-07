'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

export default function ChatPage() {
    const { getToken } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome', role: 'model', text: "Hello! I'm your CalmCove companion. I'm here to listen and support you. How are you feeling today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatText = (text: string) => {
        // Simple bold formatting for **text**
        return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        const newMsgId = Date.now().toString();

        // Add user message immediately
        setMessages(prev => [...prev, { id: newMsgId, role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const token = await getToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            if (data.response) {
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: data.response }]);
            } else {
                throw new Error('No response from AI');
            }

        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "I'm having trouble connecting right now. Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-screen">
            {/* Header */}
            <header className="p-6 border-b bg-background/95 backdrop-blur z-10 sticky top-0">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                    <Bot className="h-6 w-6 text-zen-sage" />
                    AI Companion
                </h1>
                <p className="text-muted-foreground text-sm">
                    A safe space to share your thoughts. Remember, I'm an AI, not a therapist.
                </p>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex items-start gap-4 max-w-3xl mx-auto",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                msg.role === 'user' ? "bg-zen-sage text-white" : "bg-zen-cream-dark dark:bg-muted text-muted-foreground"
                            )}>
                                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                            </div>

                            <div className={cn(
                                "p-4 rounded-2xl max-w-[80%] leading-relaxed shadow-sm",
                                msg.role === 'user'
                                    ? "bg-zen-sage text-white rounded-tr-none"
                                    : "bg-white dark:bg-card border border-border rounded-tl-none text-foreground"
                            )}>
                                {formatText(msg.text)}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-4 max-w-3xl mx-auto"
                    >
                        <div className="w-8 h-8 rounded-full bg-zen-cream-dark dark:bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="bg-white dark:bg-card border border-border p-4 rounded-2xl rounded-tl-none flex gap-1 items-center h-12">
                            <span className="w-2 h-2 bg-zen-sage/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-zen-sage/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-zen-sage/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-background border-t">
                <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-4">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-full px-6 py-6 border-zen-sage/20 focus-visible:ring-zen-sage bg-white dark:bg-secondary"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="h-12 w-12 rounded-full bg-zen-sage hover:bg-zen-sage-dark text-white shrink-0"
                        disabled={!input.trim() || isLoading}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
