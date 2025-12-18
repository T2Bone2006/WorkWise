import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const jobId = searchParams.get('jobId')

    if (!jobId) {
        return NextResponse.json({ error: 'Job ID required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: matches, error } = await supabase
        .from('worker_matches')
        .select(`
      *,
      worker:workers(*)
    `)
        .eq('job_id', jobId)
        .order('match_score', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ matches })
}