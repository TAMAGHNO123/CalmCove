import { Router } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { requireAuth } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Validation schema
const createAppointmentSchema = z.object({
    doctorName: z.string().min(1, "Doctor name is required"),
    scheduledAt: z.string().datetime().refine((date) => new Date(date) > new Date(), {
        message: "Scheduled time must be in the future"
    })
});

// Initialize Supabase client (optional - works without it using mock data)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
}

// Get user's appointments - PROTECTED
router.get('/', requireAuth, async (req, res) => {
    const userId = req.userId!; // Guaranteed to exist after requireAuth

    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }

    try {
        const { data, error } = await supabase!
            .from('appointments')
            .select('*')
            .eq('user_id', userId)
            .order('scheduled_at', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Create new appointment - PROTECTED
router.post('/', requireAuth, async (req, res) => {
    const userId = req.userId!; // Guaranteed to exist after requireAuth

    // Validate request body
    const result = createAppointmentSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error?.issues[0]?.message || "Invalid input" });
    }

    const { doctorName, scheduledAt } = result.data;

    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }

    try {
        const { data, error } = await supabase!
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
        console.error('Failed to create appointment:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

// Cancel appointment - PROTECTED
router.delete('/:id', requireAuth, async (req, res) => {
    const userId = req.userId!; // Guaranteed to exist after requireAuth
    const { id } = req.params;

    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }

    try {
        const { error } = await supabase!
            .from('appointments')
            .delete()
            .eq('id', id)
            .eq('user_id', userId); // Ensure user can only delete their own appointments

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
});

export default router;
