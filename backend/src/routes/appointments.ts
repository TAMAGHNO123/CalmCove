import { Router } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const router = Router();

// Initialize Supabase client (optional - works without it using mock data)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
}

// Get user's appointments
router.get('/', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }

    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', userId)
            .order('scheduled_at', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Create new appointment
router.post('/', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    const { doctorName, scheduledAt } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }

    try {
        const { data, error } = await supabase
            .from('appointments')
            .insert({
                user_id: userId,
                doctor_name: doctorName,
                scheduled_at: scheduledAt,
                status: 'scheduled'
            })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

// Cancel appointment
router.delete('/:id', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }

    try {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
});

export default router;
