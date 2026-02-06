'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { tipsApi } from '@/lib/api';

export function TipOfTheDay() {
    const [tip, setTip] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTip() {
            try {
                const data = await tipsApi.getToday();
                setTip(data.tip);
            } catch (error) {
                console.error('Failed to fetch tip:', error);
                // Fallback tip on error
                setTip("Take a moment to breathe deeply and center yourself.");
            } finally {
                setIsLoading(false);
                setIsVisible(true);
            }
        }

        fetchTip();
    }, []);

    if (isLoading) {
        return null; // Or a loading skeleton
    }

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
