import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check admin using service role
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const userId = claimsData.claims.sub
    const { data: adminData } = await adminClient
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!adminData) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const url = new URL(req.url)
    const days = parseInt(url.searchParams.get('days') || '30')
    const since = new Date()
    since.setDate(since.getDate() - days)
    const sinceISO = since.toISOString()

    // Get all page views in the period
    const { data: views, error: viewsError } = await adminClient
      .from('page_views')
      .select('path, session_id, referrer, created_at')
      .gte('created_at', sinceISO)
      .order('created_at', { ascending: true })

    if (viewsError) {
      console.error('Error fetching views:', viewsError)
      return new Response(JSON.stringify({ error: 'Failed to fetch analytics' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const allViews = views || []

    // Total page views
    const totalPageViews = allViews.length

    // Unique sessions
    const uniqueSessions = new Set(allViews.map(v => v.session_id).filter(Boolean)).size

    // Page views by path
    const pathCounts: Record<string, number> = {}
    for (const v of allViews) {
      pathCounts[v.path] = (pathCounts[v.path] || 0) + 1
    }

    const topPages = Object.entries(pathCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }))

    // Daily views (for chart)
    const dailyViews: Record<string, { views: number; sessions: Set<string> }> = {}
    for (const v of allViews) {
      const day = v.created_at.split('T')[0]
      if (!dailyViews[day]) {
        dailyViews[day] = { views: 0, sessions: new Set() }
      }
      dailyViews[day].views++
      if (v.session_id) dailyViews[day].sessions.add(v.session_id)
    }

    const dailyData = Object.entries(dailyViews)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({
        date,
        views: data.views,
        visitors: data.sessions.size,
      }))

    // Referrer breakdown
    const referrerCounts: Record<string, number> = {}
    for (const v of allViews) {
      let source = 'Direct'
      if (v.referrer) {
        try {
          const refUrl = new URL(v.referrer)
          const host = refUrl.hostname.toLowerCase()
          if (host.includes('google') || host.includes('bing') || host.includes('yahoo') || host.includes('duckduckgo')) {
            source = 'Organic Search'
          } else if (host.includes('twitter') || host.includes('facebook') || host.includes('linkedin') || host.includes('instagram') || host.includes('t.co') || host.includes('x.com')) {
            source = 'Social'
          } else if (host.includes('substack') || host.includes('mail') || host.includes('gmail')) {
            source = 'Email'
          } else {
            source = 'Referral'
          }
        } catch {
          source = 'Direct'
        }
      }
      referrerCounts[source] = (referrerCounts[source] || 0) + 1
    }

    const totalForPercent = allViews.length || 1
    const trafficSources = Object.entries(referrerCounts)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / totalForPercent) * 100),
      }))
      .sort((a, b) => b.value - a.value)

    // Essay-specific views
    const essayViews = topPages.filter(p => p.path.startsWith('/essays/'))

    const result = {
      totalPageViews,
      uniqueSessions,
      topPages,
      dailyData,
      trafficSources,
      essayViews,
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Get analytics error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
