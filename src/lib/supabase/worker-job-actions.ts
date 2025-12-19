'use server'

import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { createClient } from './server'
import {
    getWorkerAcceptedEmail,
    getWorkerDeclinedEmail,
    getJobCompletedEmail,
} from '../emails/client-notifications'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function acceptJob(jobId: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Get worker record
    const { data: worker } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!worker) {
        return { error: 'Worker not found' }
    }

    // Get job with client info
    const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('assigned_worker_id', worker.id)
        .single()

    if (!job) {
        return { error: 'Job not found or not assigned to you' }
    }

    if (job.status !== 'assigned') {
        return { error: 'Job cannot be accepted in current status' }
    }

    // Get client info
    const { data: client } = await supabase
        .from('b2b_clients')
        .select('*')
        .eq('id', job.client_id)
        .single()

    if (!client) {
        return { error: 'Client not found' }
    }

    // Update job status to in_progress (accepted)
    const { error: updateError } = await supabase
        .from('jobs')
        .update({
            status: 'in_progress',
        })
        .eq('id', jobId)

    if (updateError) {
        return { error: updateError.message }
    }

    // Send email notification to client
    try {
        const emailHtml = getWorkerAcceptedEmail({
            clientName: client.full_name,
            workerName: worker.full_name,
            workerEmail: worker.email,
            workerPhone: worker.phone || null,
            workerTradeType: worker.trade_type,
            jobTitle: job.title,
            jobDescription: job.description,
            propertyAddress: job.property_address,
        })

        await resend.emails.send({
            from: 'WorkWise <jobs@edentechnologies.co.uk>',
            to: client.email,
            subject: `${worker.full_name} has accepted your job: ${job.title}`,
            html: emailHtml,
        })
    } catch (emailError) {
        console.error('Failed to send acceptance email:', emailError)
    }

    revalidatePath('/worker/dashboard')
    revalidatePath('/worker/dashboard/jobs')

    return { error: null, success: true }
}

export async function declineJob(jobId: string, reason?: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Get worker record
    const { data: worker } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!worker) {
        return { error: 'Worker not found' }
    }

    // Get job with client info
    const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('assigned_worker_id', worker.id)
        .single()

    if (!job) {
        return { error: 'Job not found or not assigned to you' }
    }

    if (job.status !== 'assigned') {
        return { error: 'Job cannot be declined in current status' }
    }

    // Get client info
    const { data: client } = await supabase
        .from('b2b_clients')
        .select('*')
        .eq('id', job.client_id)
        .single()

    if (!client) {
        return { error: 'Client not found' }
    }

    // Update job status back to pending and remove worker assignment
    const { error: updateError } = await supabase
        .from('jobs')
        .update({
            status: 'pending',
            assigned_worker_id: null,
            assigned_at: null,
        })
        .eq('id', jobId)

    if (updateError) {
        return { error: updateError.message }
    }

    // Update match status to declined
    await supabase
        .from('worker_matches')
        .update({ status: 'declined' })
        .eq('job_id', jobId)
        .eq('worker_id', worker.id)

    // Send email notification to client
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const dashboardUrl = `${baseUrl}/jobs/${jobId}/matches`

    try {
        const emailHtml = getWorkerDeclinedEmail({
            clientName: client.full_name,
            workerName: worker.full_name,
            jobTitle: job.title,
            jobDescription: job.description,
            propertyAddress: job.property_address,
            declineReason: reason || null,
            dashboardUrl,
        })

        await resend.emails.send({
            from: 'WorkWise <jobs@edentechnologies.co.uk>',
            to: client.email,
            subject: `Update on your job: ${job.title}`,
            html: emailHtml,
        })
    } catch (emailError) {
        console.error('Failed to send decline email:', emailError)
    }

    revalidatePath('/worker/dashboard')
    revalidatePath('/worker/dashboard/jobs')

    return { error: null, success: true }
}

export async function markJobCompleteByWorker(jobId: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Get worker record
    const { data: worker } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!worker) {
        return { error: 'Worker not found' }
    }

    // Get job
    const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('assigned_worker_id', worker.id)
        .single()

    if (!job) {
        return { error: 'Job not found or not assigned to you' }
    }

    if (job.status !== 'assigned' && job.status !== 'in_progress') {
        return { error: 'Job cannot be completed in current status' }
    }

    // Get client info
    const { data: client } = await supabase
        .from('b2b_clients')
        .select('*')
        .eq('id', job.client_id)
        .single()

    if (!client) {
        return { error: 'Client not found' }
    }

    const completedAt = new Date()

    // Update job status to completed
    const { error: updateError } = await supabase
        .from('jobs')
        .update({
            status: 'completed',
            completed_at: completedAt.toISOString(),
        })
        .eq('id', jobId)

    if (updateError) {
        return { error: updateError.message }
    }

    // Update match status to completed
    await supabase
        .from('worker_matches')
        .update({ status: 'completed' })
        .eq('job_id', jobId)
        .eq('worker_id', worker.id)

    // Send email notification to client
    try {
        const emailHtml = getJobCompletedEmail({
            clientName: client.full_name,
            workerName: worker.full_name,
            jobTitle: job.title,
            jobDescription: job.description,
            propertyAddress: job.property_address,
            completedAt: completedAt.toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        })

        await resend.emails.send({
            from: 'WorkWise <jobs@edentechnologies.co.uk>',
            to: client.email,
            subject: `Job Completed: ${job.title}`,
            html: emailHtml,
        })
    } catch (emailError) {
        console.error('Failed to send completion email:', emailError)
    }

    revalidatePath('/worker/dashboard')
    revalidatePath('/worker/dashboard/jobs')

    return { error: null, success: true }
}

export async function getJobForWorker(jobId: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    // Get worker record
    const { data: worker } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!worker) {
        return { data: null, error: 'Worker not found' }
    }

    // Get job assigned to this worker
    const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('assigned_worker_id', worker.id)
        .single()

    if (error || !job) {
        return { data: null, error: 'Job not found or not assigned to you' }
    }

    // Get client info
    const { data: client } = await supabase
        .from('b2b_clients')
        .select('company_name, full_name, email, phone')
        .eq('id', job.client_id)
        .single()

    return {
        data: {
            ...job,
            client: client || { company_name: 'Unknown', full_name: 'Unknown', email: '', phone: null },
        },
        error: null,
    }
}
