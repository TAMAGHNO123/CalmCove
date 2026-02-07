'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Topic {
    title: string;
    description: string;
    type: string;
}

const categoryTopics: Record<string, Topic[]> = {
    'Low Stress': [
        { title: 'Maintaining Your Balance', type: 'Blog', description: 'Tips to keep your stress levels low and healthy.' },
        { title: 'The Power of Morning Routines', type: 'Article', description: 'Start your day right to stay centered.' },
        { title: 'Mindful Walking', type: 'Exercise', description: 'A simple practice to stay connected with the present.' }
    ],
    'Moderate Stress': [
        { title: '5-Minute Breathing Exercises', type: 'Tool', description: 'Quick techniques to reset your nervous system.' },
        { title: 'Understanding Stress Triggers', type: 'Guide', description: 'Identify what causes your stress and how to manage it.' },
        { title: 'The Art of Saying No', type: 'Article', description: 'Setting boundaries to protect your energy.' }
    ],
    'High Stress': [
        { title: 'Deep Relaxation Techniques', type: 'Audio', description: 'Guided sessions to help you unwind deeply.' },
        { title: 'Breaking the Stress Cycle', type: 'Blog', description: 'How to step out of chronic stress patterns.' },
        { title: 'Sleep Hygiene for Stressed Minds', type: 'Guide', description: 'Rest is crucial when stress is high.' }
    ],
    'Seek Professional Advice': [
        { title: 'When to Seek Help', type: 'Guide', description: 'Signs that professional support might be beneficial.' },
        { title: 'Finding the Right Therapist', type: 'Article', description: 'A step-by-step guide to finding care.' },
        { title: 'Crisis Resources', type: 'Directory', description: 'Immediate support contacts and helplines.' }
    ]
};

const categoryColors: Record<string, string> = {
    'Low Stress': 'from-green-50 to-emerald-100',
    'Moderate Stress': 'from-amber-50 to-yellow-100',
    'High Stress': 'from-orange-50 to-red-100',
    'Seek Professional Advice': 'from-purple-50 to-violet-100'
};

export default function CategoryPage() {
    const params = useParams();
    const category = decodeURIComponent(params.category as string);
    const topics = categoryTopics[category] || [];
    const colorClass = categoryColors[category] || 'from-gray-50 to-gray-100';

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Back Button */}
            <Link href="/dashboard/blog">
                <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Button>
            </Link>

            {/* Header */}
            <div className={`rounded-2xl p-8 mb-8 bg-gradient-to-br ${colorClass}`}>
                <h1 className="text-3xl font-bold text-foreground mb-2">{category}</h1>
                <p className="text-muted-foreground">
                    {topics.length} articles to support your wellness journey
                </p>
            </div>

            {/* Topics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic, index) => (
                    <motion.div
                        key={topic.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={`/dashboard/blog/${encodeURIComponent(category)}/${encodeURIComponent(topic.title)}`}>
                            <div className="p-6 rounded-xl bg-card border border-border hover:shadow-lg hover:border-zen-sage/30 transition-all cursor-pointer h-full flex flex-col">
                                <div className="flex items-center gap-2 text-zen-sage text-sm font-medium mb-2">
                                    <BookOpen className="w-4 h-4" />
                                    {topic.type}
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{topic.title}</h3>
                                <p className="text-muted-foreground text-sm flex-1">{topic.description}</p>
                                <div className="flex items-center gap-1 mt-4 text-zen-sage font-medium text-sm">
                                    Read article <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {topics.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No articles found for this category.</p>
                    <Link href="/dashboard/blog">
                        <Button className="mt-4 bg-zen-sage hover:bg-zen-sage-dark text-white rounded-full">
                            Browse All Categories
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
