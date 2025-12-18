import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { matchJobToWorkers } from '@/lib/ai/matching'

export async function POST(request: NextRequest) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const { job } = await request.json()

        // Create job
        const { data: createdJob, error } = await supabase
            .from('jobs')
            .insert({
                client_id: user.id,
                title: job.title,
                description: job.description,
                property_address: job.propertyAddress,
                urgency: job.urgency,
                preferred_date: job.preferredDate || null,
                status: 'pending',
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Trigger matching (don't await - fire and forget)
        matchJobToWorkers(createdJob.id).catch(console.error)

        return NextResponse.json({ job: createdJob })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}