import { Button } from '@/components/ui/button';

interface QuizQuestionProps {
    question: {
        id: number;
        question: string;
        options: { text: string; weight: number }[];
    };
    onAnswer: (weight: number) => void;
}

export function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
    return (
        <div className="zen-card">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6 leading-relaxed">
                {question.question}
            </h2>
            <div className="space-y-3">
                {question.options.map((option, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-4 px-6 text-base rounded-xl border-border hover:bg-zen-sage/10 hover:border-zen-sage/50 transition-all duration-300"
                        onClick={() => onAnswer(option.weight)}
                    >
                        {option.text}
                    </Button>
                ))}
            </div>
        </div>
    );
}
