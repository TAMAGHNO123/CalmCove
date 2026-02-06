'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { appointmentsApi } from '@/lib/api';
import { format } from 'date-fns';

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
        try {
            const token = await getToken();
            await appointmentsApi.cancel(token, id);
            // Refresh appointments
            setAppointments(prev => prev.filter(apt => apt.id !== id));
        } catch (err) {
            console.error('Failed to cancel appointment:', err);
            alert('Failed to cancel appointment');
        }
    };

    if (!userId) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-background zen-bg-pattern p-6">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Welcome back, {user?.firstName || 'there'}!
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your appointments and wellness journey
                        </p>
                    </div>
                    <Link href="/dashboard/book">
                        <Button size="lg" className="rounded-full bg-zen-sage hover:bg-zen-sage-dark text-white">
                            + Book Appointment
                        </Button>
                    </Link>
                </header>

                <section className="zen-card mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                        Upcoming Appointments
                    </h2>

                    {isLoading ? (
                        <p className="text-muted-foreground text-center py-8">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500 text-center py-8">{error}</p>
                    ) : appointments.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            No upcoming appointments. Book one to get started!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="flex items-center justify-between p-4 bg-zen-cream-dark dark:bg-secondary rounded-xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zen-sage-light to-zen-sage flex items-center justify-center text-white font-semibold">
                                            {apt.doctor_name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{apt.doctor_name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(apt.scheduled_at), 'MMM d, yyyy')} at {format(new Date(apt.scheduled_at), 'h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 text-xs font-medium bg-zen-sage/20 text-zen-sage-dark rounded-full">
                                            {apt.status}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full"
                                            onClick={() => handleCancel(apt.id)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/quiz" className="block">
                        <div className="zen-card zen-gradient-sage text-white hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-semibold mb-2">Take a Wellness Check</h3>
                            <p className="opacity-90">Quick 5-question assessment to understand your stress levels.</p>
                        </div>
                    </Link>
                    <div className="zen-card">
                        <h3 className="text-xl font-semibold text-foreground mb-2">Resources</h3>
                        <p className="text-muted-foreground">Browse articles and tips for mental wellness.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
