'use server'

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { findSimilarCachedJob, reuseCachedMatches } from './job-cache'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface Job {
    id: string
    title: string
    description: string
    property_address: string
    property_latitude?: number
    property_longitude?: number
    urgency: string
}

interface Worker {
    id: string
    full_name: string
    trade_type: string
    day_rate: number
    hourly_rate: number
    base_postcode: string
    base_latitude: number
    base_longitude: number
    service_radius_miles: number
    travel_fee_per_mile: number
    rating?: number
    jobs_completed?: number
}

interface AIProfile {
    common_jobs: any[]
    pricing_factors: any
}

export async function matchJobToWorkers(jobId: string) {
    console.log(`🔍 Starting match for job ${jobId}`)
    const supabase = await createClient()

    // Get job details
    const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

    if (jobError || !job) {
        console.log('❌ Job not found')
        return { error: 'Job not found' }
    }

    console.log(`📋 Job: ${job.title} - ${job.description}`)

    // Determine trade type from job description using AI
    const tradeType = await detectTradeType(job.title, job.description)
    console.log(`🔧 Detected trade type: ${tradeType}`)

    // CHECK CACHE: Look for similar recent jobs
    const cachedJob = await findSimilarCachedJob(job.title, job.description, tradeType)

    if (cachedJob) {
        console.log(`⚡ Using cached matches - saving API calls!`)
        return await reuseCachedMatches(cachedJob, jobId)
    }

    console.log(`🆕 No cache hit - generating fresh matches`)

    // Get active workers of the matching trade
    // Filter ONLY by: trade_type + status='active'
    const { data: workers, error: workersError } = await supabase
        .from('workers')
        .select('*')
        .eq('trade_type', tradeType)
        .eq('status', 'active')

    console.log(`👷 Found ${workers?.length || 0} active ${tradeType}s in database`)

    if (workersError || !workers || workers.length === 0) {
        console.log('❌ No workers found for trade type:', tradeType)
        return { error: 'No workers found for this job type' }
    }

    // Get AI profiles for these workers (optional - for quote generation)
    const workerIds = workers.map(w => w.id)
    const { data: aiProfiles } = await supabase
        .from('worker_ai_profiles')
        .select('*')
        .in('worker_id', workerIds)
        .eq('interview_completed', true)

    const aiProfilesMap = new Map(
        aiProfiles?.map(p => [p.worker_id, p]) || []
    )

    console.log(`🤖 ${aiProfilesMap.size}/${workers.length} workers have AI profiles`)

    // All active workers of matching trade are eligible
    // Coordinates, AI profiles, and rates are OPTIONAL (used for sorting, not filtering)
    let eligibleWorkers = workers

    console.log(`✅ ${eligibleWorkers.length} workers eligible for matching`)

    if (eligibleWorkers.length === 0) {
        return { error: 'No workers with complete profiles found in the service area' }
    }

    // SORT workers: distance (if available) > day_rate > created_at
    console.log(`🎯 Sorting ${eligibleWorkers.length} workers to select top 3...`)

    // Calculate distance for each worker (if coordinates available)
    const workersWithDistance = eligibleWorkers.map(worker => {
        let distance: number | null = null

        if (job.property_latitude && job.property_longitude &&
            worker.base_latitude && worker.base_longitude) {
            distance = calculateDistance(
                job.property_latitude,
                job.property_longitude,
                worker.base_latitude,
                worker.base_longitude
            )
        }

        return { worker, distance }
    })

    // Sort by: distance (closest first, null last) > day_rate (lowest first) > created_at (newest first)
    const sortedWorkers = workersWithDistance.sort((a, b) => {
        // Primary: distance (if both have coordinates)
        if (a.distance !== null && b.distance !== null) {
            if (a.distance !== b.distance) return a.distance - b.distance
        }
        // Workers with coordinates come before those without
        if (a.distance !== null && b.distance === null) return -1
        if (a.distance === null && b.distance !== null) return 1

        // Secondary: day_rate (lower is better)
        const aRate = a.worker.day_rate || a.worker.hourly_rate * 8 || Infinity
        const bRate = b.worker.day_rate || b.worker.hourly_rate * 8 || Infinity
        if (aRate !== bRate) return aRate - bRate

        // Tertiary: created_at (newer first)
        return new Date(b.worker.created_at || 0).getTime() - new Date(a.worker.created_at || 0).getTime()
    })

    // Take top 3 (or all if fewer than 3)
    const top3Workers = sortedWorkers.slice(0, 3).map(item => item.worker)

    // Log the selected workers
    console.log(`📋 Returning ${top3Workers.length} workers:`)
    top3Workers.forEach((worker, i) => {
        const item = sortedWorkers[i]
        const distanceStr = item.distance !== null ? `${item.distance.toFixed(1)} miles` : 'no coordinates'
        const rateStr = worker.day_rate ? `£${worker.day_rate}/day` : (worker.hourly_rate ? `£${worker.hourly_rate}/hr` : 'no rate')
        console.log(`   ${i + 1}. ${worker.full_name} (${distanceStr}, ${rateStr})`)
    })

    if (top3Workers.length === 0) {
        return { error: 'No eligible workers found after filtering' }
    }

    // Generate matches for top 3 workers IN PARALLEL
    const matchPromises = top3Workers.map(async (worker) => {
        // Use AI profile if available, otherwise use defaults
        const aiProfile = aiProfilesMap.get(worker.id) || {
            common_jobs: [],
            pricing_factors: {}
        }

        // Calculate distance and travel cost
        let distance = 0
        let travelCost = 0

        if (job.property_latitude && job.property_longitude &&
            worker.base_latitude && worker.base_longitude) {

            distance = calculateDistance(
                job.property_latitude,
                job.property_longitude,
                worker.base_latitude,
                worker.base_longitude
            )

            // Calculate travel cost (some workers have a free radius, charge beyond that)
            const freeRadius = 5 // First 5 miles free
            if (distance > freeRadius && worker.travel_fee_per_mile) {
                travelCost = (distance - freeRadius) * worker.travel_fee_per_mile
            }

            console.log(`📍 ${worker.full_name}: ${distance.toFixed(1)} miles, travel cost: £${travelCost.toFixed(2)}`)
        } else {
            console.log(`ℹ️ No coordinates - assuming local job for ${worker.full_name}`)
        }

        console.log(`✅ Generating quote for ${worker.full_name}...`)

        try {
            // Generate quote using AI
            const quote = await generateQuote(
                job,
                worker,
                aiProfile,
                distance,
                travelCost
            )

            return {
                job_id: jobId,
                worker_id: worker.id,
                match_score: quote.matchScore,
                reasoning: quote.reasoning,
                estimated_hours: quote.estimatedHours,
                estimated_days: quote.estimatedDays,
                pricing_method: quote.pricingMethod,
                base_cost: quote.baseCost,
                travel_cost: travelCost,
                total_cost: quote.totalCost,
                cost_breakdown: quote.costBreakdown,
                status: 'suggested'
            }
        } catch (error) {
            console.error(`❌ Error generating quote for ${worker.full_name}:`, error)
            return null
        }
    })

    // Wait for all quotes to complete in parallel
    console.log(`⏳ Waiting for ${matchPromises.length} parallel AI quote generations...`)
    const matchResults = await Promise.all(matchPromises)

    // Filter out null results
    const matches = matchResults.filter(match => match !== null)

    console.log(`💾 Saving ${matches.length} matches to database`)

    // Save matches to database
    if (matches.length > 0) {
        const { error: matchError } = await supabase
            .from('worker_matches')
            .insert(matches)

        if (matchError) {
            console.log('❌ Failed to save matches:', matchError.message)
            return { error: matchError.message }
        }
    }

    console.log(`✅ Matching completed: ${matches.length} matches created`)
    return { count: matches.length, error: null }
}

async function detectTradeType(title: string, description: string): Promise<string> {
    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        messages: [{
            role: 'user',
            content: `Based on this job title and description, what type of tradesperson is needed? Respond with ONLY ONE WORD from this list: electrician, plumber, carpenter, painter, builder, gas_engineer, roofer, plasterer.

Title: ${title}
Description: ${description}

Trade type:`
        }]
    })

    const tradeType = response.content[0].type === 'text'
        ? response.content[0].text.trim().toLowerCase()
        : 'electrician'

    return tradeType
}

async function generateQuote(
    job: Job,
    worker: Worker,
    aiProfile: AIProfile,
    distance: number,
    travelCost: number
) {
    const prompt = `You are estimating a job for a ${worker.trade_type}. Analyze the job and the worker's pricing data to generate an accurate quote.

JOB:
Title: ${job.title}
Description: ${job.description}
Urgency: ${job.urgency}

WORKER PRICING DATA:
Hourly rate: £${worker.hourly_rate}
Day rate: £${worker.day_rate}
Common jobs: ${JSON.stringify(aiProfile.common_jobs, null, 2)}
Pricing factors: ${JSON.stringify(aiProfile.pricing_factors, null, 2)}

INSTRUCTIONS:
1. Estimate how long this job will take (in hours or days)
2. Decide if hourly or day rate is more appropriate
3. Calculate the base cost using: (hours × hourly_rate) OR (days × day_rate)
4. Add callout fee if exists in pricing_factors
5. If urgency is "high" or "emergency", apply emergency_multiplier from pricing_factors
6. Provide a match score (0-100) based on how well this worker fits the job
7. Explain your reasoning WITHOUT mentioning specific prices (we'll show those separately)

IMPORTANT: In your reasoning, explain WHY this worker is a good match, their relevant experience, and job fit. DO NOT state specific prices or totals in the reasoning - just explain the match quality.

Respond in JSON format:
{
  "estimatedHours": number or null,
  "estimatedDays": number or null,
  "pricingMethod": "hourly" or "day_rate",
  "baseCost": number (calculated as hours × rate OR days × rate),
  "matchScore": number (0-100),
  "reasoning": "brief explanation of why this worker is a good fit, WITHOUT mentioning specific prices",
  "costBreakdown": {
    "base": { "method": "hourly" or "day_rate", "hours": number, "days": number, "rate": number, "subtotal": number },
    "callout_fee": number,
    "emergency_premium": number,
    "total": number (base + callout_fee + emergency_premium)
  }
}`

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
    })

    const responseText = response.content[0].type === 'text'
        ? response.content[0].text
        : '{}'

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const quoteData = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return {
        estimatedHours: quoteData.estimatedHours,
        estimatedDays: quoteData.estimatedDays,
        pricingMethod: quoteData.pricingMethod || 'hourly',
        baseCost: quoteData.baseCost || 0,
        totalCost: (quoteData.baseCost || 0) + travelCost,
        matchScore: quoteData.matchScore || 75,
        reasoning: quoteData.reasoning || 'Good match based on trade type and availability',
        costBreakdown: {
            ...quoteData.costBreakdown,
            travel: {
                distance_miles: distance,
                rate_per_mile: worker.travel_fee_per_mile,
                subtotal: travelCost
            },
            total: (quoteData.baseCost || 0) + travelCost
        }
    }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula for distance in miles
    const R = 3959 // Earth's radius in miles
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
}