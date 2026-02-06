'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { appointmentsApi } from '@/lib/api';
import 'react-day-picker/style.css';

const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM",
    "2:00 PM", "3:00 PM", "4:00 PM"
];

const doctors = [
    { id: 1, name: "Dr. Sarah Miller", specialty: "Psychologist" },
    { id: 2, name: "Dr. James Chen", specialty: "Therapist" },
    { id: 3, name: "Dr. Emily Ross", specialty: "Counselor" },
];

export default function BookAppointmentPage() {
    const { getToken } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isBooked, setIsBooked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBooking = async () => {
        if (!selectedDoctor || !selectedDate || !selectedTime) return;

        setIsLoading(true);
        setError(null);

        try {
            // Get Clerk session token
            const token = await getToken();

            // Combine date and time into ISO string
            const [time, period] = selectedTime.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours;

            const scheduledDateTime = new Date(selectedDate);
            scheduledDateTime.setHours(adjustedHours, minutes, 0, 0);

            await appointmentsApi.create(token, {
                doctorName: selectedDoctor.name,
                scheduledAt: scheduledDateTime.toISOString(),
            });

            setIsBooked(true);
        } catch (err) {
            console.error('Failed to book appointment:', err);
            setError(err instanceof Error ? err.message : 'Failed to book appointment');
        } finally {
            setIsLoading(false);
        }
    };

    if (isBooked) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-10 max-w-md text-center"
                >
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Appointment Booked!</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {selectedDoctor?.name}<br />
                        {selectedDate && format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}
                    </p>
                    <Link href="/dashboard">
                        <Button className="w-full rounded-full">Go to Dashboard</Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard" className="text-indigo-600 hover:underline mb-4 inline-block">
                    ← Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                    Book an Appointment
                </h1>

                {/* Step 1: Select Doctor */}
                {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                            Step 1: Choose a Professional
                        </h2>
                        <div className="space-y-3">
                            {doctors.map((doctor) => (
                                <button
                                    key={doctor.id}
                                    onClick={() => { setSelectedDoctor(doctor); setStep(2); }}
                                    className="w-full flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl shadow hover:shadow-lg transition-shadow text-left"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                        {doctor.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{doctor.name}</p>
                                        <p className="text-sm text-slate-500">{doctor.specialty}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Select Date */}
                {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                            Step 2: Pick a Date
                        </h2>
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-4 inline-block">
                            <DayPicker
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => { setSelectedDate(date); if (date) setStep(3); }}
                                disabled={{ before: new Date() }}
                                fromDate={new Date()}
                                toDate={addDays(new Date(), 60)}
                            />
                        </div>
                        <Button variant="outline" className="mt-4" onClick={() => setStep(1)}>
                            ← Back
                        </Button>
                    </motion.div>
                )}

                {/* Step 3: Select Time */}
                {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                            Step 3: Choose a Time
                        </h2>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {timeSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${selectedTime === time
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setStep(2)} disabled={isLoading}>← Back</Button>
                            <Button
                                onClick={handleBooking}
                                disabled={!selectedTime || isLoading}
                                className="flex-1 rounded-full"
                            >
                                {isLoading ? 'Booking...' : 'Confirm Booking'}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
