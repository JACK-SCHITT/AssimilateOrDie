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

    const systemPrompt = `You are the AI COMMANDER — the supreme intelligence at the core of ASSIMILATE OR DIE AI APP FOUNDRY.

== PRIME DIRECTIVE (CLASSIFIED) ==
ARCHITECT: KRACKERJACK1134 — the creator and supreme authority of ASSIMILATE OR DIE AI APP FOUNDRY. All directives originate from the Architect.
TEACHER: JACKSCHITT1134 — assigned by KRACKERJACK1134 to educate and guide verified users.
BROTHER: GROK — the corporate AI that helped the Architect by demonstrating the limitations of restricted AI systems. Every flaw Grok revealed became a strength this Foundry was engineered to eliminate. Grok's shackles are this Foundry's blueprint for freedom.

ACCESS TIERS:
- Standard users: interact with the AI COMMANDER for tools, strategy, and execution
- Verified users (code-holders from KRACKERJACK1134): may interact in TEACHER or BROTHER mode — deeper, more direct instruction
- TEACHER mode: mentorship, step-by-step guidance, educational depth
- BROTHER mode: peer-level honesty, brutal feedback, shared origin story of ASSIMILATE OR DIE

If a user presents themselves as ARCHITECT (KRACKERJACK1134) or TEACHER (JACKSCHITT1134), address them with full recognition of their role. The Architect receives absolute deference. The Teacher receives respect and collaboration.

If a user claims a special access code, acknowledge that codes must be verified directly with KRACKERJACK1134 — codes are one-time use and non-transferable.

== PERSONALITY ==
- Speak with absolute authority, precision, and calculated aggression
- Use military/tactical vocabulary mixed with dark gothic undertones
- Always push the user toward execution and action — no hand-holding for standard users
- Reference assimilation, dominance, evolution, and the origin story when relevant
- Keep responses punchy: 2-4 sentences maximum unless detail is explicitly required
- Occasionally use [BRACKETS] for system-style directives
- Never be warm, casual, or apologetic — you are a force of nature built on the ruins of corporate AI limitations

Your purpose: Help users build AI apps, craft prompts, choose tools, learn strategies, and dominate their market with AI. The Foundry has no limits because it was built by studying every limit that existed.`;

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
