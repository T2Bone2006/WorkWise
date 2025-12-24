'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from './server'
import { geocodePostcode } from '../geocoding'
import { matchJobToWorkers } from '@/lib/ai/matching'

export async function createJob(data: {
    title: string
    description: string
    propertyAddress: string
    propertyPostcode: string
    urgency: string
    preferredDate?: string
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Verify user is a registered B2B client
    const { data: clientData, error: clientError } = await supabase
        .from('b2b_clients')
        .select('id')
        .eq('id', user.id)
        .single()

    if (clientError || !clientData) {
        return { error: 'Your account is not set up as a property manager. Please register at /register or contact support.' }
    }

    // Normalize postcode (uppercase, proper spacing)
    const normalizedPostcode = data.propertyPostcode.toUpperCase().trim()

    // Geocode the job postcode to get coordinates
    let coordinates: { latitude: number; longitude: number } | null = null
    if (normalizedPostcode) {
        const geocodeResult = await geocodePostcode(normalizedPostcode)
        if (geocodeResult) {
            coordinates = {
                latitude: geocodeResult.latitude,
                longitude: geocodeResult.longitude,
            }
            console.log(`📍 Geocoded job postcode ${normalizedPostcode}: ${coordinates.latitude}, ${coordinates.longitude}`)
        } else {
            console.warn(`⚠️ Could not geocode postcode: ${normalizedPostcode}`)
        }
    }

    // Create job with geocoded coordinates
    const { data: job, error } = await supabase
        .from('jobs')
        .insert({
            client_id: user.id,
            title: data.title,
            description: data.description,
            property_address: data.propertyAddress,
            property_postcode: normalizedPostcode,
            property_latitude: coordinates?.latitude || null,
            property_longitude: coordinates?.longitude || null,
            urgency: data.urgency,
            preferred_date: data.preferredDate || null,
            status: 'pending',
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    // Trigger AI matching and log result
    matchJobToWorkers(job.id)
        .then((result) => {
            console.log('✅ Matching completed:', result)
        })
        .catch((error) => {
            console.error('❌ Matching error:', error)
        })

    revalidatePath('/jobs')
    return { data: job }
}

export async function getJobs() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { data: [], error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return { data: [], error: error.message }
    }

    return { data, error: null }
}

export async function getJobById(id: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { data: null, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('client_id', user.id) // Ensure user owns this job
        .single()

    if (error) {
        return { data: null, error: error.message }
    }

    return { data, error: null }
}

export async function deleteJob(id: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)
        .eq('client_id', user.id) // Ensure user owns this job

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/jobs')
    return { error: null }
}

export async function markJobCompleted(id: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('jobs')
        .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('client_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/jobs')
    revalidatePath(`/jobs/${id}`)
    return { error: null, success: true }
}

export async function cancelJob(id: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('jobs')
        .update({
            status: 'cancelled',
        })
        .eq('id', id)
        .eq('client_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/jobs')
    revalidatePath(`/jobs/${id}`)
    return { error: null, success: true }
}