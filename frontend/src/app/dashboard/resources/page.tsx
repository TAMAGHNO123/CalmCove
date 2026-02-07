'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { resourcesApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { BookOpen, Headphones, FileText, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Resource {
    title: string;
    type: string;
    url: string;
    description: string;
}

interface ResourcesResponse {
    category: string;
    message: string;
    resources: Resource[];
}

export default function ResourcesPage() {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [data, setData] = useState<ResourcesResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!isLoaded || !isSignedIn) return;

            try {
                const token = await getToken();
                const result = await resourcesApi.getRecommendations(token);
                setData(result);
            } catch (error) {
                console.error('Failed to load resources:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [isLoaded, isSignedIn, getToken]);

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
                {/* Header skeleton */}
                <Skeleton className="h-10 w-64 rounded-lg" />

                {/* AI Insight skeleton */}
                <div className="bg-muted/30 p-6 rounded-2xl border border-border">
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full hidden md:block" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                </div>

                {/* Resource cards skeleton */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-24 mt-2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return <div>Failed to load resources.</div>;
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Audio': return <Headphones className="w-5 h-5" />;
            case 'Article':
            case 'Blog': return <FileText className="w-5 h-5" />;
            default: return <BookOpen className="w-5 h-5" />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-4">Personalized Resources</h1>

                {/* AI Insight Card */}
                <div className="bg-gradient-to-r from-zen-sage/10 to-transparent p-6 rounded-2xl border border-zen-sage/20">
                    <div className="flex items-start gap-4">
                        <div className="bg-white p-2 rounded-full hidden md:block">
                            <span className="text-2xl">✨</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-zen-sage-dark mb-1">Your Wellness Insight</h2>
                            <p className="text-foreground/80 leading-relaxed text-lg italic">
                                "{data.message}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.resources.map((resource, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card hover:bg-accent/50 border border-border rounded-xl p-6 transition-colors shadow-sm flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-2 text-indigo-500 mb-3 font-medium text-sm">
                                {getTypeIcon(resource.type)}
                                {resource.type}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">{resource.title}</h3>
                            <p className="text-muted-foreground mb-4">{resource.description}</p>
                        </div>
                        <Link href={resource.url} className="text-primary hover:underline inline-flex items-center gap-1 font-medium mt-auto">
                            Read more <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 bg-zen-sage/10 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-zen-sage-dark">Want updated recommendations?</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                    Your needs change over time. Retake our wellness check to get fresh insights and tailored content.
                </p>
                <Link href="/quiz">
                    <Button size="lg" className="rounded-full bg-zen-sage hover:bg-zen-sage-dark text-white border-none shadow-md">
                        Retake Wellness Check
                    </Button>
                </Link>
            </div>

            {/* Browse All Articles Section */}
            <div className="mt-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-500" />
                            Explore Our Wellness Blog
                        </h2>
                        <p className="text-muted-foreground">
                            Browse all categories and discover more articles tailored to your journey.
                        </p>
                    </div>
                    <Link href="/dashboard/blog">
                        <Button className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white border-none shadow-md whitespace-nowrap">
                            Browse All Articles <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
