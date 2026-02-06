import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/');
    }

    const user = await currentUser();

    // Placeholder appointments - in production, fetch from backend
    const appointments = [
        { id: 1, doctor: "Dr. Sarah Miller", date: "Feb 10, 2026", time: "10:00 AM", status: "scheduled" },
        { id: 2, doctor: "Dr. James Chen", date: "Feb 15, 2026", time: "2:30 PM", status: "scheduled" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Welcome back, {user?.firstName || 'there'}!
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Manage your appointments and wellness journey
                        </p>
                    </div>
                    <Link href="/dashboard/book">
                        <Button size="lg" className="rounded-full">
                            + Book Appointment
                        </Button>
                    </Link>
                </header>

                <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                        Upcoming Appointments
                    </h2>

                    {appointments.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">
                            No upcoming appointments. Book one to get started!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                            {apt.doctor.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{apt.doctor}</p>
                                            <p className="text-sm text-slate-500">{apt.date} at {apt.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                            {apt.status}
                                        </span>
                                        <Button variant="outline" size="sm">
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
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-semibold mb-2">Take a Wellness Check</h3>
                            <p className="opacity-90">Quick 5-question assessment to understand your stress levels.</p>
                        </div>
                    </Link>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Resources</h3>
                        <p className="text-slate-600 dark:text-slate-400">Browse articles and tips for mental wellness.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
