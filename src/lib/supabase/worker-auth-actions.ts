'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { createClient } from './server'
import { getWorkerInviteEmail } from '../emails/worker-invite'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function workerLogin(email: string, password: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // Check if user is actually a worker
    const { data: worker } = await supabase
        .from('workers')
        .select('id')
        .eq('user_id', data.user.id)
        .single()

    if (!worker) {
        await supabase.auth.signOut()
        return { error: 'This account is not registered as a worker' }
    }

    revalidatePath('/worker/dashboard', 'layout')
    redirect('/worker/dashboard')
}

export async function workerSignup(
    email: string,
    password: string,
    fullName: string,
    phone: string,
    tradeType: string
) {
    const supabase = await createClient()

    // Check if worker is already registered
    const { data: existingWorker } = await supabase
        .from('workers')
        .select('id')
        .eq('email', email)
        .single()

    if (existingWorker) {
        return { error: 'An account with this email already exists. Please login instead.' }
    }

    // Check if email is in waitlist and get their data
    const { data: waitlistEntry } = await supabase
        .from('worker_waitlist')
        .select('*')
        .eq('email', email)
        .single()

    // Use waitlist data if available, otherwise use form data
    const workerFullName = waitlistEntry?.full_name || fullName
    const workerPhone = waitlistEntry?.phone || phone
    const workerTradeType = waitlistEntry?.trade_type || tradeType
    const workerPostcode = waitlistEntry?.postcode || null

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    })

    if (authError) {
        return { error: authError.message }
    }

    if (!authData.user) {
        return { error: 'Failed to create user' }
    }

    // 2. Create worker record
    const { error: workerError } = await supabase.from('workers').insert({
        user_id: authData.user.id,
        full_name: workerFullName,
        email: email,
        phone: workerPhone,
        trade_type: workerTradeType,
        postcode: workerPostcode,
        status: 'pending', // Will become 'active' after completing AI interview
    })

    if (workerError) {
        return { error: workerError.message }
    }

    // 3. If was in waitlist, mark as registered (or delete)
    if (waitlistEntry) {
        await supabase
            .from('worker_waitlist')
            .update({ status: 'registered' })
            .eq('id', waitlistEntry.id)
    }

    revalidatePath('/worker/onboard', 'layout')
    redirect('/worker/onboard')
}

// Check if email is in waitlist and return their data
export async function checkWaitlistEmail(email: string) {
    const supabase = await createClient()

    const { data: waitlistEntry } = await supabase
        .from('worker_waitlist')
        .select('*')
        .eq('email', email)
        .single()

    if (waitlistEntry) {
        return {
            found: true,
            data: {
                fullName: waitlistEntry.full_name,
                phone: waitlistEntry.phone || '',
                tradeType: waitlistEntry.trade_type,
                postcode: waitlistEntry.postcode,
            }
        }
    }

    return { found: false, data: null }
}

export async function getWorkerData() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (error) {
        return null
    }

    return data
}

// Invite a worker from the waitlist to register
export async function inviteWorkerFromWaitlist(waitlistId: string) {
    const supabase = await createClient()

    // Get waitlist entry
    const { data: waitlistEntry, error: fetchError } = await supabase
        .from('worker_waitlist')
        .select('*')
        .eq('id', waitlistId)
        .single()

    if (fetchError || !waitlistEntry) {
        return { error: 'Waitlist entry not found' }
    }

    if (waitlistEntry.status === 'registered') {
        return { error: 'This worker has already registered' }
    }

    if (waitlistEntry.status === 'invited') {
        return { error: 'This worker has already been invited' }
    }

    // Update status to invited
    const { error: updateError } = await supabase
        .from('worker_waitlist')
        .update({ status: 'invited', invited_at: new Date().toISOString() })
        .eq('id', waitlistId)

    if (updateError) {
        return { error: updateError.message }
    }

    // Send invite email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const registerUrl = `${baseUrl}/worker/register`

    try {
        const emailHtml = getWorkerInviteEmail({
            workerName: waitlistEntry.full_name,
            tradeType: waitlistEntry.trade_type,
            registerUrl,
        })

        await resend.emails.send({
            from: 'WorkWise <hello@edentechnologies.co.uk>',
            to: waitlistEntry.email,
            subject: "You're Invited to Join WorkWise!",
            html: emailHtml,
        })
    } catch (emailError) {
        console.error('Failed to send invite email:', emailError)
        return { error: 'Failed to send invite email' }
    }

    revalidatePath('/seed') // Or wherever the waitlist admin page is

    return { error: null, success: true }
}

// Bulk invite all pending workers from waitlist
export async function inviteAllPendingWorkers() {
    const supabase = await createClient()

    // Get all pending waitlist entries
    const { data: pendingWorkers, error: fetchError } = await supabase
        .from('worker_waitlist')
        .select('*')
        .eq('status', 'pending')
        .limit(50) // Batch limit to avoid email rate limits

    if (fetchError) {
        return { error: fetchError.message }
    }

    if (!pendingWorkers || pendingWorkers.length === 0) {
        return { error: 'No pending workers to invite' }
    }

    let invited = 0
    let failed = 0

    for (const worker of pendingWorkers) {
        const result = await inviteWorkerFromWaitlist(worker.id)
        if (result.success) {
            invited++
        } else {
            failed++
        }
    }

    return {
        error: null,
        success: true,
        stats: { invited, failed, total: pendingWorkers.length }
    }
}