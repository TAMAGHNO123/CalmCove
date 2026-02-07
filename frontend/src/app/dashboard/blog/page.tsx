'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';

interface Category {
    name: string;
    slug: string;
    description: string;
    color: string;
}

const categories: Category[] = [
    {
        name: 'Low Stress',
        slug: 'Low%20Stress',
        description: 'Maintaining wellness and building healthy habits',
        color: 'from-green-50 to-emerald-100 border-green-200'
    },
    {
        name: 'Moderate Stress',
        slug: 'Moderate%20Stress',
        description: 'Managing everyday stress and finding balance',
        color: 'from-amber-50 to-yellow-100 border-amber-200'
    },
    {
        name: 'High Stress',
        slug: 'High%20Stress',
        description: 'Coping strategies for challenging times',
        color: 'from-orange-50 to-red-100 border-orange-200'
    },
    {
        name: 'Seek Professional Advice',
        slug: 'Seek%20Professional%20Advice',
        description: 'Guidance on getting professional support',
        color: 'from-purple-50 to-violet-100 border-purple-200'
    }
];

const popularTopics = [
    { category: 'Low%20Stress', topic: 'Maintaining Your Balance' },
    { category: 'Moderate%20Stress', topic: '5-Minute Breathing Exercises' },
    { category: 'High%20Stress', topic: 'Deep Relaxation Techniques' },
    { category: 'Low%20Stress', topic: 'The Power of Morning Routines' },
];

export default function BlogPage() {
    const { isLoaded } = useAuth();

    if (!isLoaded) {
        return (
            <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-zen-sage" />
                    Wellness Blog
                </h1>
                <p className="text-muted-foreground text-lg">
                    AI-generated articles tailored to your wellness journey
                </p>
            </div>

            {/* Categories */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold text-foreground mb-4">Browse by Category</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/dashboard/blog/${category.slug}`}>
                                <div className={`p-6 rounded-2xl border bg-gradient-to-br ${category.color} hover:shadow-lg transition-all cursor-pointer`}>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">{category.name}</h3>
                                    <p className="text-muted-foreground text-sm">{category.description}</p>
                                    <div className="flex items-center gap-1 mt-3 text-zen-sage font-medium text-sm">
                                        Explore <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Popular Topics */}
            <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Popular Topics
                </h2>
                <div className="grid gap-3 md:grid-cols-2">
                    {popularTopics.map((item, index) => (
                        <motion.div
                            key={item.topic}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                        >
                            <Link href={`/dashboard/blog/${item.category}/${encodeURIComponent(item.topic)}`}>
                                <div className="p-4 rounded-xl bg-card border border-border hover:bg-accent/50 transition-colors cursor-pointer flex items-center justify-between">
                                    <span className="font-medium text-foreground">{item.topic}</span>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
