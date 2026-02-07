'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
    User,
    Mail,
    Calendar,
    Heart,
    TrendingUp,
    Award,
    ClipboardCheck,
    Sparkles,
    Settings
} from 'lucide-react';

interface QuizResult {
    id: string;
    category: string;
    score: number;
    created_at: string;
}

interface Stats {
    totalQuizzes: number;
    averageScore: number;
    lastCategory: string;
    memberSince: string;
}

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!isLoaded || !user) return;

            try {
                const token = await getToken();

                // Fetch quiz history
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const history = await response.json();
                    setQuizHistory(history);

                    // Calculate stats
                    if (history.length > 0) {
                        const avgScore = history.reduce((sum: number, q: QuizResult) => sum + q.score, 0) / history.length;
                        setStats({
                            totalQuizzes: history.length,
                            averageScore: Math.round(avgScore),
                            lastCategory: history[0]?.category || 'N/A',
                            memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'
                        });
                    } else {
                        setStats({
                            totalQuizzes: 0,
                            averageScore: 0,
                            lastCategory: 'Take your first quiz!',
                            memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
                setStats({
                    totalQuizzes: 0,
                    averageScore: 0,
                    lastCategory: 'Take your first quiz!',
                    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [isLoaded, user, getToken]);

    if (!isLoaded || isLoading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
                <div className="flex items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Low Stress': return 'text-green-600 bg-green-100';
            case 'Moderate Stress': return 'text-yellow-600 bg-yellow-100';
            case 'High Stress': return 'text-orange-600 bg-orange-100';
            case 'Seek Professional Advice': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="zen-card mb-8"
            >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative">
                        <img
                            src={user?.imageUrl || '/default-avatar.png'}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-zen-sage/30 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-zen-sage text-white p-1.5 rounded-full">
                            <Sparkles className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold text-foreground">
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 text-muted-foreground">
                            <span className="flex items-center justify-center md:justify-start gap-1">
                                <Mail className="w-4 h-4" />
                                {user?.primaryEmailAddress?.emailAddress}
                            </span>
                            <span className="flex items-center justify-center md:justify-start gap-1">
                                <Calendar className="w-4 h-4" />
                                Member since {stats?.memberSince}
                            </span>
                        </div>
                    </div>

                    <Button variant="outline" className="rounded-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                <div className="zen-card text-center">
                    <div className="bg-zen-sage/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ClipboardCheck className="w-6 h-6 text-zen-sage" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats?.totalQuizzes || 0}</p>
                    <p className="text-sm text-muted-foreground">Wellness Checks</p>
                </div>

                <div className="zen-card text-center">
                    <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats?.averageScore || 0}</p>
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                </div>

                <div className="zen-card text-center">
                    <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{quizHistory.length > 0 ? 'Active' : 'New'}</p>
                    <p className="text-sm text-muted-foreground">Journey Status</p>
                </div>

                <div className="zen-card text-center">
                    <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{quizHistory.length >= 5 ? 'Gold' : quizHistory.length >= 2 ? 'Silver' : 'Bronze'}</p>
                    <p className="text-sm text-muted-foreground">Member Tier</p>
                </div>
            </motion.div>

            {/* Current Wellness Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="zen-card mb-8"
            >
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-zen-sage" />
                    Current Wellness Status
                </h2>

                {stats?.lastCategory && stats.lastCategory !== 'Take your first quiz!' ? (
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <div>
                            <p className="text-muted-foreground text-sm">Latest Assessment Result</p>
                            <p className={`text-lg font-semibold px-3 py-1 rounded-full inline-block mt-1 ${getCategoryColor(stats.lastCategory)}`}>
                                {stats.lastCategory}
                            </p>
                        </div>
                        <Button asChild className="bg-zen-sage hover:bg-zen-sage-dark text-white rounded-full">
                            <a href="/quiz">Retake Quiz</a>
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-muted/50 rounded-xl">
                        <p className="text-muted-foreground mb-4">You haven't taken a wellness check yet.</p>
                        <Button asChild className="bg-zen-sage hover:bg-zen-sage-dark text-white rounded-full">
                            <a href="/quiz">Take Your First Quiz</a>
                        </Button>
                    </div>
                )}
            </motion.div>

            {/* Quiz History */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="zen-card"
            >
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-zen-sage" />
                    Wellness Journey
                </h2>

                {quizHistory.length > 0 ? (
                    <div className="space-y-3">
                        {quizHistory.slice(0, 5).map((quiz, index) => (
                            <div
                                key={quiz.id || index}
                                className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zen-sage/20 flex items-center justify-center text-zen-sage font-semibold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className={`font-medium px-2 py-0.5 rounded-full text-sm inline-block ${getCategoryColor(quiz.category)}`}>
                                            {quiz.category}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {new Date(quiz.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-foreground">{quiz.score}</p>
                                    <p className="text-xs text-muted-foreground">Score</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Your wellness journey starts with your first check.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
