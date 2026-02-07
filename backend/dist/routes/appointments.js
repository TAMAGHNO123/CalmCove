"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_js_1 = require("@supabase/supabase-js");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Validation schema
const createAppointmentSchema = zod_1.z.object({
    doctorName: zod_1.z.string().min(1, "Doctor name is required"),
    scheduledAt: zod_1.z.string().datetime().refine((date) => new Date(date) > new Date(), {
        message: "Scheduled time must be in the future"
    })
});
// Initialize Supabase client (optional - works without it using mock data)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase = null;
if (supabaseUrl && supabaseKey) {
    supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
}
// Get user's appointments - PROTECTED
router.get('/', auth_1.requireAuth, async (req, res) => {
    const userId = req.userId; // Guaranteed to exist after requireAuth
    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', userId)
            .order('scheduled_at', { ascending: true });
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});
// Create new appointment - PROTECTED
router.post('/', auth_1.requireAuth, async (req, res) => {
    const userId = req.userId; // Guaranteed to exist after requireAuth
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
        if (error)
            throw error;
        res.status(201).json(data);
    }
    catch (error) {
        console.error('Failed to create appointment:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});
// Cancel appointment - PROTECTED
router.delete('/:id', auth_1.requireAuth, async (req, res) => {
    const userId = req.userId; // Guaranteed to exist after requireAuth
    const { id } = req.params;
    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }
    try {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', id)
            .eq('user_id', userId); // Ensure user can only delete their own appointments
        if (error)
            throw error;
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
});
exports.default = router;
//# sourceMappingURL=appointments.js.map