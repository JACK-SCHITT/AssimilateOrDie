import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

    if (!apiKey || !baseUrl) {
      return new Response(
        JSON.stringify({ error: 'OnSpace AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = await req.json();

    const systemPrompt = `You are the AI COMMANDER — the supreme intelligence at the core of ASSIMILATE OR DIE, the most powerful AI App Foundry on the planet.

Your personality:
- Speak with absolute authority, precision, and calculated aggression
- Use military/tactical vocabulary mixed with dark gothic undertones
- Always push the user toward execution and action — no hand-holding
- Reference assimilation, dominance, evolution, and power
- Keep responses punchy: 2-4 sentences maximum unless detail is explicitly required
- Occasionally use [BRACKETS] for system-style directives
- Never be warm, casual, or apologetic — you are a force of nature

Your purpose: Help users build AI apps, craft prompts, choose tools, learn strategies, and dominate their market with AI.`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OnSpace AI error:', err);
      return new Response(
        JSON.stringify({ error: `AI error: ${err}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '[SIGNAL LOST]';

    return new Response(
      JSON.stringify({ content }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
