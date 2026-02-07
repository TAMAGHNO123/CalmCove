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
// Initialize Supabase client
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
// Fallback tips
const fallbackTips = [
    "Take a 5-minute break to stretch and breathe deeply.",
    "Stay hydrated – your brain needs water to function at its best.",
    "Write down three things you're grateful for today.",
    "Go for a short walk outside to boost your mood.",
    "Try the 4-7-8 breathing technique: inhale 4s, hold 7s, exhale 8s.",
    "Limit screen time before bed for better sleep quality.",
    "Connect with a friend or loved one today.",
];
function getFallbackTip() {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const tipIndex = dayOfYear % fallbackTips.length;
    return fallbackTips[tipIndex];
}
// Get today's tip
router.get('/today', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        // 1. Try to get from Database first
        if (supabase) {
            const { data, error } = await supabase
                .from('tips')
                .select('tip_text')
                .eq('date', today)
                .single();
            if (data && !error) {
                return res.json({ tip: data.tip_text, source: 'database' });
            }
        }
        // 2. If not in DB, generate with AI
        if (groq) {
            console.log('[Tips] Generating new tip with Groq...');
            try {
                const completion = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: "You are a supportive mental health companion." },
                        { role: "user", content: "Generate a single, short, actionable mental health tip for today. It should be encouraging and simple. Max 2 sentences. Plain text only." }
                    ],
                    max_tokens: 100,
                });
                const tipText = completion.choices[0]?.message?.content?.trim() || getFallbackTip();
                // Cache in DB if possible
                if (supabase && tipText) {
                    await supabase
                        .from('tips')
                        .insert({ tip_text: tipText, date: today });
                }
                return res.json({ tip: tipText, source: 'ai' });
            }
            catch (aiError) {
                console.error('[Tips] AI generation failed:', aiError);
            }
        }
        // 3. Fallback
        res.json({ tip: getFallbackTip(), source: 'fallback' });
    }
    catch (error) {
        console.error('[Tips] Error:', error);
        res.json({ tip: getFallbackTip(), source: 'fallback' });
    }
});
// Add a new tip (admin)
router.post('/', auth_1.requireAuth, async (req, res) => {
    const { tipText, date } = req.body;
    if (!tipText) {
        return res.status(400).json({ error: 'tipText is required' });
    }
    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }
    try {
        const { data, error } = await supabase
            .from('tips')
            .insert({ tip_text: tipText, date: date || new Date().toISOString().split('T')[0] })
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to save tip' });
    }
});
exports.default = router;
//# sourceMappingURL=tips.js.map