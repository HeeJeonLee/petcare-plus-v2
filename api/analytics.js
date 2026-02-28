// api/analytics.js
// Vercel serverless function - Analytics data collection and processing

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionData, events } = req.body;

    // Log analytics data
    console.log('📊 Analytics Received:', {
      sessionDuration: sessionData.timeOnPage,
      pageViews: sessionData.pageViews,
      clicks: sessionData.clicks,
      conversions: sessionData.conversions,
      scrollDepth: sessionData.scrollDepth.toFixed(2) + '%',
      deviceInfo: sessionData.deviceInfo,
      eventsCount: events.length
    });

    // Store analytics in Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cpejxivbyvlpkmthgwfq.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/analytics_events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            session_data: sessionData,
            events: events,
            created_at: new Date().toISOString()
          })
        });
      } catch (dbError) {
        console.warn('⚠️ Failed to store in Supabase:', dbError);
      }
    }

    // Generate optimization suggestions if high traffic
    if (events.length > 20) {
      try {
        const suggestionPrompt = `
Based on user analytics showing ${events.length} events with ${sessionData.conversions} conversions, 
${sessionData.clicks} clicks, and ${sessionData.scrollDepth.toFixed(0)}% scroll depth, 
suggest 3 quick wins for PetCare+ optimization.
        `;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 500,
            messages: [{ role: 'user', content: suggestionPrompt }]
          })
        });

        if (response.ok) {
          const aiData = await response.json();
          console.log('🤖 AI Suggestions:', aiData.content[0].text);
        }
      } catch (aiError) {
        console.warn('⚠️ AI suggestion generation failed:', aiError);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Analytics processed successfully',
      eventsProcessed: events.length
    });

  } catch (error) {
    console.error('❌ Analytics error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
