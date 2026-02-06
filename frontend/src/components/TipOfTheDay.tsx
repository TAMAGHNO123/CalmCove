'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const fallbackTips = [
    "Take a 5-minute break to stretch and breathe deeply.",
    "Stay hydrated – your brain needs water to function at its best.",
    "Write down three things you're grateful for today.",
    "Go for a short walk outside to boost your mood.",
    "Try the 4-7-8 breathing technique: inhale 4s, hold 7s, exhale 8s.",
    "Limit screen time before bed for better sleep quality.",
    "Connect with a friend or loved one today.",
];

export function TipOfTheDay() {
    const [tip, setTip] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Get a consistent daily tip based on date
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
        const tipIndex = dayOfYear % fallbackTips.length;
        setTip(fallbackTips[tipIndex] || fallbackTips[0]);
        setIsVisible(true);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="zen-card bg-gradient-to-br from-zen-sage-light/20 to-zen-blue-light/20 border border-zen-sage/20"
        >
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-zen-sage to-zen-sage-dark flex items-center justify-center shadow-md shadow-zen-sage/20">
                    <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-base mb-1 text-foreground">Tip of the Day</h3>
                    <p className="text-muted-foreground leading-relaxed">{tip}</p>
                </div>
            </div>
        </motion.div>
    );
}
