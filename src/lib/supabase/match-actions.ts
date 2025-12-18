'use server'

import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { createClient } from './server'
import { getWorkerAssignmentEmail } from '../emails/worker-assignment'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function getJobMatches(jobId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('worker_matches')
        .select(`
      *,
      worker:workers(*)
    `)
        .eq('job_id', jobId)
        .order('match_score', { ascending: false })

    if (error) {
        return { data: [], error: error.message }
    }

    return { data, error: null }
}

export async function assignWorkerToJob(jobId: string, workerId: string, matchId: string) {
    const supabase = await createClient()

    // Fetch job details
    const { data: job, error: jobFetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

    if (jobFetchError || !job) {
        return { error: 'Job not found' }
    }

    // Fetch worker details
    const { data: worker, error: workerFetchError } = await supabase
        .from('workers')
        .select('*')
        .eq('id', workerId)
        .single()

    if (workerFetchError || !worker) {
        return { error: 'Worker not found' }
    }

    // Fetch client details
    const { data: client, error: clientFetchError } = await supabase
        .from('b2b_clients')
        .select('*')
        .eq('id', job.client_id)
        .single()

    if (clientFetchError || !client) {
        return { error: 'Client not found' }
    }

    // Fetch match details for cost
    const { data: match, error: matchFetchError } = await supabase
        .from('worker_matches')
        .select('*')
        .eq('id', matchId)
        .single()

    if (matchFetchError || !match) {
        return { error: 'Match not found' }
    }

    // Update job status and assign worker
    const { error: jobError } = await supabase
        .from('jobs')
        .update({
            status: 'assigned',
            assigned_worker_id: workerId,
            assigned_at: new Date().toISOString(),
        })
        .eq('id', jobId)

    if (jobError) {
        return { error: jobError.message }
    }

    // Update match status to 'assigned'
    const { error: matchError } = await supabase
        .from('worker_matches')
        .update({ status: 'assigned' })
        .eq('id', matchId)

    if (matchError) {
        return { error: matchError.message }
    }

    // Generate accept/decline URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const acceptUrl = `${baseUrl}/worker/jobs/${jobId}/respond?action=accept`
    const declineUrl = `${baseUrl}/worker/jobs/${jobId}/respond?action=decline`

    // Format preferred date if exists
    const preferredDate = job.preferred_date
        ? new Date(job.preferred_date).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : null

    // Send email notification to worker
    try {
        const emailHtml = getWorkerAssignmentEmail({
            workerName: worker.full_name,
            jobTitle: job.title,
            jobDescription: job.description,
            propertyAddress: job.property_address,
            urgency: job.urgency,
            preferredDate,
            clientName: client.full_name,
            clientCompany: client.company_name,
            clientEmail: client.email,
            clientPhone: client.phone || null,
            estimatedCost: match.total_cost,
            acceptUrl,
            declineUrl,
        })

        await resend.emails.send({
            from: 'WorkWise <jobs@edentechnologies.co.uk>',
            to: worker.email,
            subject: `New Job: ${job.title} - You've been selected!`,
            html: emailHtml,
        })
    } catch (emailError) {
        console.error('Failed to send assignment email:', emailError)
        // Don't fail the assignment if email fails - job is still assigned
    }

    revalidatePath('/jobs')
    revalidatePath(`/jobs/${jobId}/matches`)

    return { error: null, success: true }
}