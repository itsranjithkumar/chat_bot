import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Be concise and friendly in your responses.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data.error);
      return NextResponse.json(
        { reply: `Sorry, the AI service returned an error: ${data.error?.message || 'unknown'}` },
        { status: 500 }
      );
    }

    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error('Invalid response format:', data);
      return NextResponse.json({ reply: 'Sorry, I could not generate a response.' }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return NextResponse.json({ reply: 'Sorry, something went wrong. Please try again.' }, { status: 500 });
  }
}