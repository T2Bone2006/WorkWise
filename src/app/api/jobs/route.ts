import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get matches for each job
    const jobsWithMatches = await Promise.all(
        jobs.map(async (job) => {
            const { data: matches } = await supabase
                .from('worker_matches')
                .select(`
          *,
          worker:workers(*)
        `)
                .eq('job_id', job.id)
                .order('match_score', { ascending: false })

            return {
                ...job,
                matches: matches || [],
            }
        })
    )

    return NextResponse.json({ jobs: jobsWithMatches })
}