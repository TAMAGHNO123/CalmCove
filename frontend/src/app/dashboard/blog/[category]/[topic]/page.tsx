'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { blogApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BlogContent {
    title: string;
    description: string;
    symptoms: string[];
    solutions: string[];
}

export default function BlogPage() {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const params = useParams();
    const category = decodeURIComponent(params.category as string);
    const topic = decodeURIComponent(params.topic as string);

    const [content, setContent] = useState<BlogContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchContent() {
            if (!isLoaded || !isSignedIn) return;

            try {
                const token = await getToken();
                const result = await blogApi.getPost(token, category, topic);
                setContent(result);
            } catch (err) {
                console.error('Failed to load blog:', err);
                setError('Failed to load content. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchContent();
    }, [isLoaded, isSignedIn, getToken, category, topic]);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <Skeleton className="h-8 w-32 mb-6" />
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/4 mb-8" />
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        );
    }

    if (error || !content) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 text-center">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
                        {error || 'Content not available'}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        We couldn&apos;t generate content for this topic. Please check if your Gemini API key is configured.
                    </p>
                    <Link href="/dashboard/blog">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Back Button */}
            <Link href="/dashboard/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
            </Link>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
                    {category}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {content.title}
                </h1>
            </motion.div>

            {/* Description */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose prose-lg dark:prose-invert max-w-none mb-10"
            >
                <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                    {content.description}
                </p>
            </motion.div>

            {/* Symptoms Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 mb-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-300">
                        Common Symptoms
                    </h2>
                </div>
                <ul className="space-y-3">
                    {content.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                            <span className="text-amber-900 dark:text-amber-200">{symptom}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Solutions Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 mb-8"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300">
                        Helpful Solutions
                    </h2>
                </div>
                <ul className="space-y-4">
                    {content.solutions.map((solution, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-emerald-900 dark:text-emerald-200">{solution}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Disclaimer */}
            <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-xl p-4">
                <p>
                    This content is generated by AI for informational purposes only and should not replace professional medical advice.
                    If you&apos;re experiencing severe symptoms, please consult a healthcare professional.
                </p>
            </div>
        </div>
    );
}
