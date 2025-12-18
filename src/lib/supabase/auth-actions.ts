'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from './server'

export async function login(email: string, password: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    if (!data.user) {
        return { error: 'Login failed' }
    }

    // Check if user is a property manager (b2b_client)
    const { data: clientData } = await supabase
        .from('b2b_clients')
        .select('id')
        .eq('id', data.user.id)
        .single()

    if (clientData) {
        revalidatePath('/jobs', 'layout')
        redirect('/jobs')
    }

    // Check if user is a worker
    const { data: workerData } = await supabase
        .from('workers')
        .select('id')
        .eq('user_id', data.user.id)
        .single()

    if (workerData) {
        redirect('/workwise/workers/dashboard')
    }

    // If neither, log them out
    await supabase.auth.signOut()
    return { error: 'Account not found. Please contact support.' }
}

export async function signup(
    email: string,
    password: string,
    companyName: string,
    fullName: string
) {
    const supabase = await createClient()

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

    // 2. Create B2B client record
    const { error: clientError } = await supabase.from('b2b_clients').insert({
        id: authData.user.id, // Use auth user ID as client ID
        company_name: companyName,
        full_name: fullName,
        email: email,
    })

    if (clientError) {
        return { error: clientError.message }
    }

    revalidatePath('/jobs', 'layout')
    redirect('/jobs')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function getUser() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    return user
}

export async function getClientData() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const { data, error } = await supabase
        .from('b2b_clients')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        return null
    }

    return data
}