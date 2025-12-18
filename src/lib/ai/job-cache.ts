'use server'

import { createClient } from '@/lib/supabase/server'

interface CachedJob {
    job_id: string
    title: string
    description: string
    trade_type: string
    matches: any[]
    created_at: string
}

/**
 * Find a similar job from the last 24 hours
 */
export async function findSimilarCachedJob(
    title: string,
    description: string,
    tradeType: string
): Promise<CachedJob | null> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Get recent jobs (last 24 hours) with matches
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: recentJobs, error } = await supabase
        .from('jobs')
        .select(`
      id,
      title,
      description,
      created_at,
      worker_matches (
        *,
        worker:workers(*)
      )
    `)
        .eq('client_id', user.id)
        .gte('created_at', yesterday)
        .order('created_at', { ascending: false })

    if (error || !recentJobs || recentJobs.length === 0) {
        return null
    }

    // Simple keyword-based similarity
    const keywords = extractKeywords(title + ' ' + description)

    for (const job of recentJobs) {
        const jobKeywords = extractKeywords(job.title + ' ' + job.description)
        const similarity = calculateSimilarity(keywords, jobKeywords)

        // If >70% similar and has matches, use it
        if (similarity > 0.7 && job.worker_matches && job.worker_matches.length > 0) {
            console.log(`♻️ Found similar cached job (${(similarity * 100).toFixed(0)}% match): "${job.title}"`)
            return {
                job_id: job.id,
                title: job.title,
                description: job.description,
                trade_type: tradeType,
                matches: job.worker_matches,
                created_at: job.created_at
            }
        }
    }

    return null
}

function extractKeywords(text: string): Set<string> {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'])

    const words = text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word))

    return new Set(words)
}

function calculateSimilarity(set1: Set<string>, set2: Set<string>): number {
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])

    return intersection.size / union.size
}

export async function reuseCachedMatches(
    cachedJob: CachedJob,
    newJobId: string
) {
    const supabase = await createClient()

    console.log(`♻️ Reusing ${cachedJob.matches.length} cached matches`)

    // Clone matches for new job
    const newMatches = cachedJob.matches.map(match => ({
        job_id: newJobId,
        worker_id: match.worker_id,
        match_score: match.match_score,
        reasoning: match.reasoning + ' (Similar to previous job)',
        estimated_hours: match.estimated_hours,
        estimated_days: match.estimated_days,
        pricing_method: match.pricing_method,
        base_cost: match.base_cost,
        travel_cost: match.travel_cost,
        total_cost: match.total_cost,
        cost_breakdown: match.cost_breakdown,
        status: 'suggested'
    }))

    // Insert new matches
    const { error } = await supabase
        .from('worker_matches')
        .insert(newMatches)

    if (error) {
        console.error('❌ Failed to reuse cached matches:', error)
        return { error: error.message }
    }

    console.log(`✅ Successfully reused ${newMatches.length} cached matches`)
    return { count: newMatches.length, error: null }
}