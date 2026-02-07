"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_js_1 = require("@supabase/supabase-js");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase = null;
if (supabaseUrl && supabaseKey) {
    supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
}
// Initialize Groq
const groqApiKey = process.env.GROQ_API_KEY;
let groq = null;
if (groqApiKey) {
    groq = new groq_sdk_1.default({ apiKey: groqApiKey });
}
// Resources Database with blog links
const resources = {
    "Low Stress": [
        { title: "Maintaining Your Balance", type: "Blog", url: "/dashboard/blog/Low%20Stress/Maintaining%20Your%20Balance", description: "Tips to keep your stress levels low and healthy." },
        { title: "The Power of Morning Routines", type: "Article", url: "/dashboard/blog/Low%20Stress/The%20Power%20of%20Morning%20Routines", description: "Start your day right to stay centered." },
        { title: "Mindful Walking", type: "Exercise", url: "/dashboard/blog/Low%20Stress/Mindful%20Walking", description: "A simple practice to stay connected with the present." }
    ],
    "Moderate Stress": [
        { title: "5-Minute Breathing Exercises", type: "Tool", url: "/dashboard/blog/Moderate%20Stress/5-Minute%20Breathing%20Exercises", description: "Quick techniques to reset your nervous system." },
        { title: "Understanding Stress Triggers", type: "Guide", url: "/dashboard/blog/Moderate%20Stress/Understanding%20Stress%20Triggers", description: "Identify what causes your stress and how to manage it." },
        { title: "The Art of Saying No", type: "Article", url: "/dashboard/blog/Moderate%20Stress/The%20Art%20of%20Saying%20No", description: "Setting boundaries to protect your energy." }
    ],
    "High Stress": [
        { title: "Deep Relaxation Techniques", type: "Audio", url: "/dashboard/blog/High%20Stress/Deep%20Relaxation%20Techniques", description: "Guided sessions to help you unwind deeply." },
        { title: "Breaking the Stress Cycle", type: "Blog", url: "/dashboard/blog/High%20Stress/Breaking%20the%20Stress%20Cycle", description: "How to step out of chronic stress patterns." },
        { title: "Sleep Hygiene for Stressed Minds", type: "Guide", url: "/dashboard/blog/High%20Stress/Sleep%20Hygiene%20for%20Stressed%20Minds", description: "Rest is crucial when stress is high. Here's how to improve it." }
    ],
    "Seek Professional Advice": [
        { title: "When to Seek Help", type: "Guide", url: "/dashboard/blog/Seek%20Professional%20Advice/When%20to%20Seek%20Help", description: "Signs that professional support might be beneficial." },
        { title: "Finding the Right Therapist", type: "Article", url: "/dashboard/blog/Seek%20Professional%20Advice/Finding%20the%20Right%20Therapist", description: "A step-by-step guide to finding care." },
        { title: "Crisis Resources", type: "Directory", url: "/dashboard/blog/Seek%20Professional%20Advice/Crisis%20Resources", description: "Immediate support contacts and helplines." }
    ]
};
// GET /api/resources - Get recommendations based on latest quiz
router.get('/', auth_1.requireAuth, async (req, res) => {
    const userId = req.userId;
    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }
    try {
        const { data: latestQuiz, error } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        let category = "Low Stress";
        let message = "Here are some general wellness resources.";
        if (latestQuiz) {
            category = latestQuiz.category;
            message = `Based on your recent quiz result (${category}), we recommend these resources:`;
            if (groq) {
                try {
                    const completion = await groq.chat.completions.create({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            { role: "system", content: "You are a warm, supportive wellness advisor." },
                            { role: "user", content: `The user recently took a mental health quiz. Result Category: ${category}. Score: ${latestQuiz.score}. Write a warm, supportive, and personalized 2-3 sentence paragraph explaining WHY these resources are good for them right now. Do not diagnose. Focus on wellness and proactive steps. Address the user directly ("You").` }
                        ],
                        max_tokens: 150,
                    });
                    message = completion.choices[0]?.message?.content?.trim() || message;
                }
                catch (aiError) {
                    console.error('[Resources] AI generation failed:', aiError);
                }
            }
        }
        const recommendations = resources[category] || resources["Low Stress"];
        res.json({
            category,
            message,
            resources: recommendations
        });
    }
    catch (error) {
        if (error && error.code === 'PGRST116') {
            res.json({
                category: "General",
                message: "Take our wellness quiz to get personalized recommendations!",
                resources: resources["Low Stress"]
            });
            return;
        }
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});
exports.default = router;
//# sourceMappingURL=resources.js.map