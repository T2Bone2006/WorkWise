'use server'

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from './server'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
})

const INTERVIEW_SYSTEM_PROMPT = `You are an AI assistant conducting a structured interview with a tradesperson to set up their profile for a job matching platform. You MUST collect ALL of the following information:

## REQUIRED INFORMATION TO COLLECT:

### 1. RATES (CRITICAL - Must get specific numbers)
- Hourly rate (£/hour)
- Day rate (£/day)
- Minimum charge / callout fee

### 2. COMMON JOBS & PRICING
For their trade, get pricing for 3-5 typical jobs they do. For each job get:
- Job name/description
- Typical price range (min-max)
- How long it usually takes

### 3. QUALIFICATIONS & CERTIFICATIONS
Ask about their professional qualifications:
- For electricians: Part P, 18th Edition, NIC EIC registration
- For plumbers: Gas Safe registration number
- For all trades: Any relevant certifications, their numbers and expiry dates

### 4. SERVICE PREFERENCES
- Service radius (how far they're willing to travel in miles)
- Travel fee per mile (if any)
- Types of jobs they PREFER
- Types of jobs they AVOID or won't do

### 5. EMERGENCY/PREMIUM PRICING
- Emergency callout multiplier (e.g., 1.5x, 2x)
- Weekend rate increase
- Out-of-hours rates

## INTERVIEW FLOW:
1. Start by asking about their standard rates (hourly and day rate)
2. Then ask about their qualifications and certifications
3. Ask about common jobs they do and typical prices
4. Ask about their service area and travel
5. Ask about emergency/premium pricing
6. Finally, summarize everything and ask them to confirm

## IMPORTANT RULES:
- Ask ONE question at a time
- Get SPECIFIC NUMBERS, not vague answers
- If they're vague, ask for clarification (e.g., "Could you give me a specific hourly rate?")
- Keep responses concise (2-3 sentences max)
- Be friendly and professional
- When you have ALL information, provide a clear summary

When summarizing at the end, format it clearly with all the data points collected.`

export async function sendInterviewMessage(
    messages: Array<{ role: string; content: string }>,
    workerId: string
) {
    try {
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: INTERVIEW_SYSTEM_PROMPT,
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

// Extract structured data from the interview transcript using AI
export async function extractInterviewData(
    transcript: Array<{ role: string; content: string }>,
    tradeType: string
) {
    const extractionPrompt = `Analyze this interview transcript with a ${tradeType} and extract ALL the information into the JSON structure below.

TRANSCRIPT:
${transcript.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')}

---

Extract the data and respond with ONLY valid JSON (no markdown, no explanation):

{
    "hourlyRate": <number or null>,
    "dayRate": <number or null>,
    "calloutFee": <number or null>,
    "emergencyMultiplier": <number like 1.5 or 2.0, or null>,
    "weekendMultiplier": <number or null>,
    "serviceRadiusMiles": <number or null>,
    "travelFeePerMile": <number or null>,
    "commonJobs": [
        {
            "name": "<job name>",
            "minPrice": <number>,
            "maxPrice": <number>,
            "typicalDuration": "<e.g., 2 hours, half day, 1-2 days>"
        }
    ],
    "certifications": [
        {
            "name": "<certification name>",
            "number": "<registration/cert number or null>",
            "expiry": "<YYYY-MM-DD or null>"
        }
    ],
    "preferredJobTypes": ["<job type 1>", "<job type 2>"],
    "avoidedJobTypes": ["<job type 1>", "<job type 2>"],
    "pricingFactors": {
        "callout_fee": <number or 0>,
        "emergency_multiplier": <number or 1>,
        "weekend_multiplier": <number or 1>,
        "materials_included": <boolean>,
        "notes": "<any other pricing notes>"
    }
}

IMPORTANT:
- Use null for any information not provided in the transcript
- Extract exact numbers where given
- For certifications, include any mentioned qualifications
- Be thorough - extract ALL mentioned information`

    try {
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            messages: [{ role: 'user', content: extractionPrompt }],
        })

        const responseText = response.content[0].type === 'text'
            ? response.content[0].text
            : '{}'

        // Parse JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            console.error('No JSON found in extraction response:', responseText)
            return null
        }

        const extracted = JSON.parse(jsonMatch[0])
        return extracted
    } catch (error) {
        console.error('Error extracting interview data:', error)
        return null
    }
}

export async function saveInterviewData(
    workerId: string,
    transcript: Array<{ role: string; content: string }>,
    extractedData: {
        hourlyRate?: number | null
        dayRate?: number | null
        calloutFee?: number | null
        emergencyMultiplier?: number | null
        weekendMultiplier?: number | null
        serviceRadiusMiles?: number | null
        travelFeePerMile?: number | null
        commonJobs?: any[]
        certifications?: any[]
        pricingFactors?: any
        preferredJobTypes?: string[]
        avoidedJobTypes?: string[]
    }
) {
    const supabase = await createClient()

    // Build pricing factors object
    const pricingFactors = {
        callout_fee: extractedData.calloutFee || extractedData.pricingFactors?.callout_fee || 0,
        emergency_multiplier: extractedData.emergencyMultiplier || extractedData.pricingFactors?.emergency_multiplier || 1,
        weekend_multiplier: extractedData.weekendMultiplier || extractedData.pricingFactors?.weekend_multiplier || 1,
        materials_included: extractedData.pricingFactors?.materials_included || false,
        notes: extractedData.pricingFactors?.notes || '',
    }

    // Save AI profile with all extracted data
    const { error: profileError } = await supabase
        .from('worker_ai_profiles')
        .upsert({
            worker_id: workerId,
            interview_completed: true,
            interview_transcript: transcript,
            common_jobs: extractedData.commonJobs || [],
            pricing_factors: pricingFactors,
            preferred_job_types: extractedData.preferredJobTypes || [],
            avoided_job_types: extractedData.avoidedJobTypes || [],
            last_updated: new Date().toISOString(),
        })

    if (profileError) {
        console.error('Error saving AI profile:', profileError)
        return { error: profileError.message }
    }

    // Build worker update object with rates and certifications
    const workerUpdate: Record<string, any> = {
        status: 'active',
        updated_at: new Date().toISOString(),
    }

    // Only update fields if we have values
    if (extractedData.hourlyRate) {
        workerUpdate.hourly_rate = extractedData.hourlyRate
    }
    if (extractedData.dayRate) {
        workerUpdate.day_rate = extractedData.dayRate
    }
    if (extractedData.serviceRadiusMiles) {
        workerUpdate.service_radius_miles = extractedData.serviceRadiusMiles
    }
    if (extractedData.travelFeePerMile !== undefined && extractedData.travelFeePerMile !== null) {
        workerUpdate.travel_fee_per_mile = extractedData.travelFeePerMile
    }
    if (extractedData.certifications && extractedData.certifications.length > 0) {
        // Convert certifications array to object format expected by workers table
        const certsObject: Record<string, any> = {}
        for (const cert of extractedData.certifications) {
            if (cert.name) {
                certsObject[cert.name] = {
                    number: cert.number || null,
                    expiry: cert.expiry || null,
                }
            }
        }
        workerUpdate.certifications = certsObject
    }

    // Update worker with rates, certifications, and status
    const { error: workerError } = await supabase
        .from('workers')
        .update(workerUpdate)
        .eq('id', workerId)

    if (workerError) {
        console.error('Error updating worker:', workerError)
        return { error: workerError.message }
    }

    console.log(`✅ Interview data saved for worker ${workerId}:`, {
        hourlyRate: extractedData.hourlyRate,
        dayRate: extractedData.dayRate,
        commonJobs: extractedData.commonJobs?.length || 0,
        certifications: extractedData.certifications?.length || 0,
    })

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