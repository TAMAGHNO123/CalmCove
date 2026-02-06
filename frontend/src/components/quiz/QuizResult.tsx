'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, RefreshCw, Calendar } from 'lucide-react';

interface QuizResultProps {
    result: {
        category: string;
        color: string;
        message: string;
    };
    onRestart: () => void;
}

// Map harsh colors to Zen-friendly equivalents
const zenColorMap: Record<string, string> = {
    'text-green-500': 'text-zen-sage',
    'text-yellow-500': 'text-zen-stone',
    'text-orange-500': 'text-zen-blue-dark',
    'text-red-500': 'text-zen-stone-light',
};

export function QuizResult({ result, onRestart }: QuizResultProps) {
    const zenColor = zenColorMap[result.color] || 'text-zen-sage';

    return (
        <div className="min-h-screen bg-background zen-bg-pattern flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="zen-card max-w-lg text-center"
            >
                <div className="mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-zen-sage-light to-zen-sage flex items-center justify-center mb-4 shadow-lg shadow-zen-sage/20"
                    >
                        <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                        Your Result
                    </h2>
                    <p className={`text-xl md:text-2xl font-medium ${zenColor}`}>
                        {result.category}
                    </p>
                </div>

                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    {result.message}
                </p>

                <div className="flex flex-col gap-3">
                    <Button
                        size="lg"
                        className="w-full rounded-full bg-zen-sage hover:bg-zen-sage-dark text-white transition-all duration-300"
                        onClick={onRestart}
                    >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Take Quiz Again
                    </Button>
                    <Link href="/dashboard">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full rounded-full border-zen-blue/30 hover:bg-zen-blue/10 hover:border-zen-blue transition-all duration-300"
                        >
                            <Calendar className="w-5 h-5 mr-2" />
                            Book an Appointment
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
