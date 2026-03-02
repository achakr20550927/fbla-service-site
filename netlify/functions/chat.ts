import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { messages, model, temperature } = JSON.parse(event.body || '{}');

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

        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({
                    error: {
                        message: data.error?.message || `OpenRouter API returned ${response.status}`,
                    },
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error: any) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: {
                    message: 'Internal server error occurred while connecting to the AI service.',
                },
            }),
        };
    }
};
