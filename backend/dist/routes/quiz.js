"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_js_1 = require("@supabase/supabase-js");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase = null;
if (supabaseUrl && supabaseKey) {
    supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
}
// Validation Schema
const quizResultSchema = zod_1.z.object({
    score: zod_1.z.number().min(0).max(100), // Assuming percentage score
});
// Categories logic
const determineCategory = (percentage) => {
    if (percentage <= 30)
        return "Low Stress";
    if (percentage <= 60)
        return "Moderate Stress";
    if (percentage <= 80)
        return "High Stress";
    return "Seek Professional Advice";
};
// POST /api/quiz - Save result
router.post('/', auth_1.requireAuth, async (req, res) => {
    console.log('[Quiz] POST request received');
    const userId = req.userId;
    console.log('[Quiz] User ID:', userId);
    console.log('[Quiz] Body:', req.body);
    const parse = quizResultSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ error: parse.error.issues[0]?.message || "Invalid input" });
    }
    const { score } = parse.data;
    const category = determineCategory(score);
    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }
    try {
        const { data, error } = await supabase
            .from('quiz_results')
            .insert({
            user_id: userId,
            score,
            category
        })
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json(data);
    }
    catch (error) {
        console.error('Error saving quiz result:', error);
        res.status(500).json({ error: 'Failed to save quiz result' });
    }
});
// GET /api/quiz/latest - Get latest result
router.get('/latest', auth_1.requireAuth, async (req, res) => {
    const userId = req.userId;
    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }
    try {
        const { data, error } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
            throw error;
        }
        res.json(data || null); // Return null if no result found
    }
    catch (error) {
        console.error('Error fetching latest quiz:', error);
        res.status(500).json({ error: 'Failed to fetch quiz result' });
    }
});
// GET /api/quiz/history - Get all results for user
router.get('/history', auth_1.requireAuth, async (req, res) => {
    const userId = req.userId;
    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }
    try {
        const { data, error } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);
        if (error)
            throw error;
        res.json(data || []);
    }
    catch (error) {
        console.error('Error fetching quiz history:', error);
        res.status(500).json({ error: 'Failed to fetch quiz history' });
    }
});
exports.default = router;
//# sourceMappingURL=quiz.js.map