'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { appointmentsApi } from '@/lib/api';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { TipOfTheDay } from '@/components/TipOfTheDay';
import { Calendar, Heart, MessageCircle, BookOpen, ArrowRight } from 'lucide-react';

interface Appointment {
    id: string;
    doctor_name: string;
    scheduled_at: string;
    status: string;
}

export default function DashboardPage() {
    const { userId, getToken } = useAuth();
    const { user } = useUser();
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            router.push('/');
            return;
        }

        async function fetchAppointments() {
            try {
                const token = await getToken();
                const data = await appointmentsApi.getAll(token);
                setAppointments(data || []);
            } catch (err) {
                console.error('Failed to fetch appointments:', err);
                setError(err instanceof Error ? err.message : 'Failed to load appointments');
            } finally {
                setIsLoading(false);
            }
        }

        fetchAppointments();
    }, [userId, getToken, router]);

    const handleCancel = async (id: string) => {
        setCancellingId(id);
        try {
            const token = await getToken();
            await appointmentsApi.cancel(token, id);
            setAppointments(prev => prev.filter(apt => apt.id !== id));
            toast.success('Appointment cancelled successfully');
        } catch (err) {
            console.error('Failed to cancel appointment:', err);
            toast.error('Could not cancel appointment');
        } finally {
            setCancellingId(null);
        }
    };

    if (!userId) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background zen-bg-pattern p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        Welcome back, {user?.firstName || 'there'}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Your daily sanctuary for peace and balance.
                    </p>
                </header>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - 2 cols */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Row 1: Tip of the Day */}
                        <TipOfTheDay />

                        {/* Row 2: Appointments */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-2xl p-6 border border-border bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-rose-50/80 dark:from-amber-900/20 dark:via-orange-900/10 dark:to-rose-900/20"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground">
                                        Upcoming Appointments
                                    </h2>
                                </div>
                                <Link href="/dashboard/book">
                                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-100/50 dark:text-orange-400">
                                        View All <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>

                            {isLoading ? (
                                <div className="space-y-3">
                                    {[1, 2].map((i) => (
                                        <Skeleton key={i} className="h-16 rounded-xl" />
                                    ))}
                                </div>
                            ) : error ? (
                                <p className="text-red-500 text-center py-6">{error}</p>
                            ) : appointments.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">No upcoming appointments.</p>
                                    <Link href="/dashboard/book">
                                        <Button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none shadow-md">
                                            Book Your First Session
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <motion.div layout className="space-y-3">
                                    <AnimatePresence mode="popLayout">
                                        {appointments.slice(0, 3).map((apt) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                key={apt.id}
                                                className="flex items-center justify-between p-4 bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-xl border border-amber-100 dark:border-amber-800/30"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                                        {apt.doctor_name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{apt.doctor_name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {format(new Date(apt.scheduled_at), 'MMM d')} at {format(new Date(apt.scheduled_at), 'h:mm a')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={cancellingId === apt.id}
                                                    className="rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleCancel(apt.id)}
                                                >
                                                    {cancellingId === apt.id ? '...' : 'Cancel'}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </motion.section>
                    </div>

                    {/* Right Column - Wellness Check (spans full height) */}
                    <div className="lg:row-span-2">
                        <Link href="/quiz" className="block h-full">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                whileHover={{ scale: 1.02 }}
                                className="rounded-2xl p-8 h-full min-h-[300px] flex flex-col justify-between bg-gradient-to-br from-green-50 via-emerald-50/80 to-white dark:from-emerald-900/30 dark:via-emerald-800/20 dark:to-card border border-green-100 dark:border-emerald-800/30 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                            >
                                <div>
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zen-sage/20 to-emerald-100 dark:from-zen-sage/30 dark:to-emerald-800/30 flex items-center justify-center mb-6">
                                        <Heart className="w-7 h-7 text-zen-sage" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-foreground">Take a Wellness Check</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        A quick 5-question assessment to understand your current stress levels and get personalized recommendations.
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                                        <span className="w-2 h-2 rounded-full bg-zen-sage/60"></span>
                                        Takes only 2 minutes
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                                        <span className="w-2 h-2 rounded-full bg-zen-sage/60"></span>
                                        Personalized insights
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
                                        <span className="w-2 h-2 rounded-full bg-zen-sage/60"></span>
                                        Tailored resources
                                    </div>

                                    <div className="flex items-center justify-between bg-zen-sage text-white rounded-full px-6 py-3 shadow-md">
                                        <span className="font-medium">Start Assessment</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
