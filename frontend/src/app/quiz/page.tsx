'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { QuizResult } from '@/components/quiz/QuizResult';
import { useAuth } from '@clerk/nextjs';
import { quizApi } from '@/lib/api';

const questions = [
    {
        id: 1,
        question: "How often do you feel overwhelmed by your daily responsibilities?",
        options: [
            { text: "Rarely or never", weight: 0 },
            { text: "Sometimes", weight: 1 },
            { text: "Often", weight: 2 },
            { text: "Almost always", weight: 3 },
        ],
    },
    {
        id: 2,
        question: "How well have you been sleeping lately?",
        options: [
            { text: "Very well, I feel rested", weight: 0 },
            { text: "Fairly well", weight: 1 },
            { text: "Not great, I often feel tired", weight: 2 },
            { text: "Poorly, I struggle to sleep", weight: 3 },
        ],
    },
    {
        id: 3,
        question: "How often do you take time for activities you enjoy?",
        options: [
            { text: "Daily", weight: 0 },
            { text: "A few times a week", weight: 1 },
            { text: "Rarely", weight: 2 },
            { text: "Almost never", weight: 3 },
        ],
    },
    {
        id: 4,
        question: "How would you describe your energy levels throughout the day?",
        options: [
            { text: "High and consistent", weight: 0 },
            { text: "Generally good", weight: 1 },
            { text: "Low at times", weight: 2 },
            { text: "Constantly drained", weight: 3 },
        ],
    },
    {
        id: 5,
        question: "How connected do you feel to friends and family?",
        options: [
            { text: "Very connected", weight: 0 },
            { text: "Somewhat connected", weight: 1 },
            { text: "A bit isolated", weight: 2 },
            { text: "Very isolated", weight: 3 },
        ],
    },
];

export default function QuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showResult, setShowResult] = useState(false);

    const { getToken } = useAuth();

    const handleAnswer = (weight: number) => {
        const newAnswers = [...answers, weight];
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Quiz complete
            setShowResult(true);
            saveResult(newAnswers);
        }
    };

    const saveResult = async (finalAnswers: number[]) => {
        try {
            const totalScore = finalAnswers.reduce((sum, val) => sum + val, 0);
            const maxScore = questions.length * 3;
            const percentage = Math.round((totalScore / maxScore) * 100);

            const token = await getToken();
            await quizApi.saveResult(token, percentage);
            // Optionally toast success
        } catch (error) {
            console.error("Failed to save quiz result", error);
        }
    };

    const calculateResult = () => {
        const totalScore = answers.reduce((sum, val) => sum + val, 0);
        const maxScore = questions.length * 3;
        const percentage = (totalScore / maxScore) * 100;

        if (percentage <= 30) return { category: "Low Stress", color: "text-green-500", message: "You're managing stress well. Keep up the good habits!" };
        if (percentage <= 60) return { category: "Moderate Stress", color: "text-yellow-500", message: "You're experiencing some stress. Consider incorporating relaxation techniques." };
        if (percentage <= 80) return { category: "High Stress", color: "text-orange-500", message: "Your stress levels are elevated. It may help to talk to someone you trust." };
        return { category: "Seek Professional Advice", color: "text-red-500", message: "Consider reaching out to a mental health professional for support." };
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResult(false);
    };

    if (showResult) {
        const result = calculateResult();
        return <QuizResult result={result} onRestart={restartQuiz} />;
    }

    return (
        <div className="min-h-screen bg-background zen-bg-pattern flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-xl">
                <QuizProgress current={currentQuestion + 1} total={questions.length} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <QuizQuestion
                            question={questions[currentQuestion]}
                            onAnswer={handleAnswer}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
