'use server'

import { createClient } from './server'

export async function getWorkers(filters?: {
    tradeType?: string
    status?: string
}) {
    const supabase = await createClient()

    let query = supabase
        .from('workers')
        .select('*')
        .order('created_at', { ascending: false })

    if (filters?.tradeType) {
        query = query.eq('trade_type', filters.tradeType)
    }

    if (filters?.status) {
        query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) {
        return { data: [], error: error.message }
    }

    return { data, error: null }
}

export async function getWorkerById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return { data: null, error: error.message }
    }

    return { data, error: null }
}