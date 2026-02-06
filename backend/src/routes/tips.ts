import { Router } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Initialize Supabase client (optional)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
}

// Fallback tips if database is empty or unavailable
const fallbackTips = [
    "Take a 5-minute break to stretch and breathe deeply.",
    "Stay hydrated – your brain needs water to function at its best.",
    "Write down three things you're grateful for today.",
    "Go for a short walk outside to boost your mood.",
    "Try the 4-7-8 breathing technique: inhale 4s, hold 7s, exhale 8s.",
    "Limit screen time before bed for better sleep quality.",
    "Connect with a friend or loved one today.",
];

// Helper to get fallback tip
function getFallbackTip() {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const tipIndex = dayOfYear % fallbackTips.length;
    return fallbackTips[tipIndex];
}

// Get today's tip
router.get('/today', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    // If no supabase, return fallback
    if (!supabase) {
        return res.json({ tip: getFallbackTip(), source: 'fallback' });
    }

    try {
        // Try to get tip from database
        const { data, error } = await supabase!
            .from('tips')
            .select('tip_text')
            .eq('date', today)
            .single();

        if (data && !error) {
            return res.json({ tip: data.tip_text, source: 'database' });
        }

        // Fallback to rotating tips
        res.json({ tip: getFallbackTip(), source: 'fallback' });
    } catch (error) {
        // Return fallback on any error
        res.json({ tip: getFallbackTip(), source: 'fallback' });
    }
});

// Add a new tip (for admin/cron use) - PROTECTED
router.post('/', requireAuth, async (req, res) => {
    const { tipText, date } = req.body;

    if (!tipText) {
        return res.status(400).json({ error: 'tipText is required' });
    }

    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }

    const tipDate = date || new Date().toISOString().split('T')[0];

    try {
        const { data, error } = await supabase!
            .from('tips')
            .insert({ tip_text: tipText, date: date || new Date().toISOString().split('T')[0] })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save tip' });
    }
});

export default router;
