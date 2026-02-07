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
// GET /api/blog/:category/:topic - Get or generate blog content
router.get('/:category/:topic', auth_1.requireAuth, async (req, res) => {
    const { category, topic } = req.params;
    const topicSlug = decodeURIComponent(topic).toLowerCase().replace(/\s+/g, '-');
    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }
    try {
        // Check cache first
        const { data: cached, error: cacheError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('category', category)
            .eq('topic_slug', topicSlug)
            .single();
        if (cached && !cacheError) {
            console.log(`[Blog] Cache hit for ${category}/${topicSlug}`);
            return res.json(cached.content);
        }
        // Generate with Groq
        if (!groq) {
            return res.status(503).json({ error: 'AI service not configured. Please add GROQ_API_KEY to .env' });
        }
        console.log(`[Blog] Generating content for ${category}/${topic}`);
        const prompt = `You are a mental health expert. Generate a helpful blog post about "${topic}" for someone experiencing "${category}" stress level.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
    "title": "A compelling, supportive title",
    "description": "A 2-3 paragraph description explaining this topic, written in a warm, supportive tone. Include what this condition/topic means and why it's important to address.",
    "symptoms": ["symptom 1", "symptom 2", "symptom 3", "symptom 4", "symptom 5"],
    "solutions": ["solution 1 with brief explanation", "solution 2 with brief explanation", "solution 3 with brief explanation", "solution 4 with brief explanation", "solution 5 with brief explanation"]
}

Make the content empathetic, actionable, and evidence-based. Do not include any disclaimers in the JSON - just the helpful content.`;
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a mental health content expert. Return only valid JSON." },
                { role: "user", content: prompt }
            ],
            max_tokens: 1000,
        });
        const responseText = completion.choices[0]?.message?.content || '';
        // Parse the JSON response
        let content;
        try {
            const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
            content = JSON.parse(cleanedResponse);
        }
        catch (parseError) {
            console.error('[Blog] Failed to parse Groq response:', responseText);
            return res.status(500).json({ error: 'Failed to parse AI response' });
        }
        // Cache the result
        const { error: insertError } = await supabase
            .from('blog_posts')
            .upsert({
            category,
            topic_slug: topicSlug,
            title: content.title,
            content
        }, { onConflict: 'category,topic_slug' });
        if (insertError) {
            console.error('[Blog] Failed to cache:', insertError);
        }
        res.json(content);
    }
    catch (error) {
        console.error('[Blog] Error:', error);
        res.status(500).json({ error: 'Failed to generate blog content' });
    }
});
exports.default = router;
//# sourceMappingURL=blog.js.map