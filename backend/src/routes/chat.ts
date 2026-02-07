import { Router } from 'express';
import Groq from 'groq-sdk';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Initialize Groq
const groqApiKey = process.env.GROQ_API_KEY;
let groq: Groq | null = null;

if (groqApiKey) {
    groq = new Groq({ apiKey: groqApiKey });
}

const systemPrompt = `You are a supportive, empathetic mental health companion for the CalmCove platform.
Your role is to listen, offer gentle encouragement, and suggest general wellness strategies.

IMPORTANT GUIDELINES:
1. DO NOT provide medical diagnoses or prescriptions.
2. DO NOT act as a licensed therapist.
3. IF a user expresses intention of self-harm, suicide, or harming others, you MUST immediately provide this crisis resource: "I'm concerned about what you're sharing. Please reach out to a professional immediately. In the US, you can call or text 988 for the Suicide & Crisis Lifeline. You are not alone."
4. Keep responses concise (under 3 sentences usually) and warm.
5. Ask open-ended questions to help the user reflect, but don't interrogate.`;

// POST /api/chat - Send a message to the AI
router.post('/', requireAuth, async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    if (!groq) {
        return res.status(503).json({ error: 'AI service not configured', response: "I'm currently offline. Please try again later." });
    }

    try {
        const messages: Groq.Chat.ChatCompletionMessageParam[] = [
            { role: "system", content: systemPrompt }
        ];

        // Add conversation history if provided
        if (history && Array.isArray(history)) {
            for (const msg of history) {
                if (msg.role === 'user') {
                    messages.push({ role: "user", content: msg.text });
                } else if (msg.role === 'model') {
                    messages.push({ role: "assistant", content: msg.text });
                }
            }
        }

        // Add the current message
        messages.push({ role: "user", content: message });

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            max_tokens: 300,
        });

        const response = completion.choices[0]?.message?.content?.trim() || "I'm having trouble responding right now.";

        res.json({ response });

    } catch (error) {
        console.error('[Chat] Error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

export default router;
