import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages, model, temperature } = req.body;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
                'HTTP-Referer': 'https://silencetheviolenceec.com',
                'X-Title': 'Silence the Violence Assistant',
            },
            body: JSON.stringify({
                model: model || 'gpt-4o-mini',
                messages,
                temperature: temperature || 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return res.status(response.status).json({
                error: {
                    message: errorData.error?.message || `OpenRouter API returned ${response.status}`,
                },
            });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error: any) {
        console.error('Proxy error:', error);
        return res.status(500).json({
            error: {
                message: 'Internal server error occurred while connecting to the AI service.',
            },
        });
    }
}
