interface QuizProgressProps {
    current: number;
    total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
    const percentage = (current / total) * 100;

    return (
        <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Question {current} of {total}</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="w-full h-2 bg-zen-cream-dark dark:bg-secondary rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-zen-sage to-zen-sage-dark rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
