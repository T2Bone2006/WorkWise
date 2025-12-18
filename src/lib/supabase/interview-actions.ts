'use server'

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from './server'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function sendInterviewMessage(
    messages: Array<{ role: string; content: string }>,
    workerId: string
) {
    try {
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: `You are an AI assistant conducting a friendly interview with a tradesperson to understand their pricing, preferences, and working style. Your goal is to extract:

1. Their typical pricing for common jobs in their trade
2. Whether they prefer hourly rates or day rates for different job types
3. Their callout fees or minimum charges
4. Emergency or out-of-hours pricing
5. Their service area and travel preferences
6. Types of jobs they prefer or avoid
7. Any other pricing factors (materials, complexity, etc.)

Keep the conversation natural and conversational. Ask follow-up questions to clarify. Be friendly and professional. When you have enough information, summarize what you've learned and confirm it's correct.

Keep responses concise (2-3 sentences max per response).`,
            messages: messages as any,
        })

        const assistantMessage = response.content[0].type === 'text'
            ? response.content[0].text
            : ''

        return { message: assistantMessage, error: null }
    } catch (error: any) {
        return { message: null, error: error.message }
    }
}

export async function saveInterviewData(
    workerId: string,
    transcript: Array<{ role: string; content: string }>,
    extractedData: {
        commonJobs: any[]
        pricingFactors: any
        preferredJobTypes: string[]
        avoidedJobTypes: string[]
    }
) {
    const supabase = await createClient()

    // Save AI profile
    const { error: profileError } = await supabase
        .from('worker_ai_profiles')
        .upsert({
            worker_id: workerId,
            interview_completed: true,
            interview_transcript: transcript,
            common_jobs: extractedData.commonJobs,
            pricing_factors: extractedData.pricingFactors,
            preferred_job_types: extractedData.preferredJobTypes,
            avoided_job_types: extractedData.avoidedJobTypes,
        })

    if (profileError) {
        return { error: profileError.message }
    }

    // Update worker status to active
    const { error: workerError } = await supabase
        .from('workers')
        .update({ status: 'active' })
        .eq('id', workerId)

    if (workerError) {
        return { error: workerError.message }
    }

    return { error: null }
}

export async function getWorkerAIProfile(workerId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('worker_ai_profiles')
        .select('*')
        .eq('worker_id', workerId)
        .single()

    if (error) {
        return { data: null, error: error.message }
    }

    return { data, error: null }
}