'use server'

import { createClient } from './server'

export async function seedAIProfiles() {
    const supabase = await createClient()

    // First, get all workers
    const { data: workers, error: workersError } = await supabase
        .from('workers')
        .select('id, full_name, trade_type')

    if (workersError || !workers) {
        return { error: 'Failed to fetch workers' }
    }

    const aiProfiles = workers.map((worker) => {
        // Different pricing data based on trade type
        let commonJobs, pricingFactors, preferredJobTypes: string[] = [], avoidedJobTypes: string[] = []

        if (worker.trade_type === 'electrician') {
            commonJobs = [
                {
                    job_type: 'socket_installation',
                    typical_price: 60,
                    typical_time_hours: 1,
                    notes: '£60 for single socket, £70 for double socket'
                },
                {
                    job_type: 'light_fitting',
                    typical_price: 50,
                    typical_time_hours: 0.5,
                    notes: 'Simple light fitting, includes testing'
                },
                {
                    job_type: 'consumer_unit_replacement',
                    typical_price: 400,
                    typical_time_hours: 5,
                    notes: 'Full day job, prefer day rate'
                },
                {
                    job_type: 'full_rewire',
                    pricing_method: 'day_rate',
                    typical_time_days: 3,
                    notes: 'Always quote day rate for rewires'
                },
                {
                    job_type: 'fault_finding',
                    typical_price: 80,
                    typical_time_hours: 1.5,
                    notes: 'Includes £20 callout, plus hourly rate'
                }
            ]

            pricingFactors = {
                callout_fee: 20,
                emergency_multiplier: 1.5,
                emergency_callout: 50,
                prefers_day_rate_for: ['full_rewires', 'large_projects', 'consumer_unit_replacement'],
                prefers_hourly_for: ['small_repairs', 'socket_installation', 'light_fitting']
            }

            preferredJobTypes = ['socket_installation', 'consumer_unit_replacement', 'full_rewire']
            avoidedJobTypes = ['outdoor_wiring']

        } else if (worker.trade_type === 'plumber') {
            commonJobs = [
                {
                    job_type: 'leaking_tap',
                    typical_price: 70,
                    typical_time_hours: 1,
                    notes: 'Standard tap repair or replacement'
                },
                {
                    job_type: 'toilet_repair',
                    typical_price: 90,
                    typical_time_hours: 1.5,
                    notes: 'Includes parts for cistern repair'
                },
                {
                    job_type: 'radiator_installation',
                    typical_price: 200,
                    typical_time_hours: 3,
                    notes: 'Plus materials, includes bleeding and testing'
                },
                {
                    job_type: 'boiler_service',
                    typical_price: 100,
                    typical_time_hours: 1.5,
                    notes: 'Annual service, Gas Safe required'
                },
                {
                    job_type: 'bathroom_installation',
                    pricing_method: 'day_rate',
                    typical_time_days: 5,
                    notes: 'Always day rate for full bathroom'
                }
            ]

            pricingFactors = {
                callout_fee: 25,
                emergency_multiplier: 2,
                emergency_callout: 80,
                prefers_day_rate_for: ['bathroom_installation', 'full_heating_system'],
                prefers_hourly_for: ['leaking_tap', 'toilet_repair', 'radiator_installation']
            }

            preferredJobTypes = ['boiler_service', 'radiator_installation', 'bathroom_installation']
            avoidedJobTypes = ['drainage', 'septic_tanks']

        } else if (worker.trade_type === 'carpenter') {
            commonJobs = [
                {
                    job_type: 'door_hanging',
                    typical_price: 100,
                    typical_time_hours: 2,
                    notes: 'Internal door, includes adjustment'
                },
                {
                    job_type: 'skirting_boards',
                    typical_price: 150,
                    typical_time_hours: 3,
                    notes: 'Per room, depends on size'
                },
                {
                    job_type: 'kitchen_fitting',
                    pricing_method: 'day_rate',
                    typical_time_days: 3,
                    notes: 'Always day rate for kitchens'
                },
                {
                    job_type: 'deck_building',
                    pricing_method: 'day_rate',
                    typical_time_days: 4,
                    notes: 'Outdoor work, weather dependent'
                },
                {
                    job_type: 'shelving',
                    typical_price: 80,
                    typical_time_hours: 1.5,
                    notes: 'Custom shelving, materials extra'
                }
            ]

            pricingFactors = {
                callout_fee: 15,
                emergency_multiplier: 1.3,
                prefers_day_rate_for: ['kitchen_fitting', 'deck_building', 'flooring'],
                prefers_hourly_for: ['door_hanging', 'skirting_boards', 'shelving']
            }

            preferredJobTypes = ['kitchen_fitting', 'door_hanging', 'skirting_boards']
            avoidedJobTypes = ['roofing', 'structural_work']

        } else {
            // Default for other trades
            commonJobs = [
                {
                    job_type: 'standard_repair',
                    typical_price: 80,
                    typical_time_hours: 1.5,
                    notes: 'General repair work'
                }
            ]

            pricingFactors = {
                callout_fee: 20,
                emergency_multiplier: 1.5
            }

            preferredJobTypes = []
            avoidedJobTypes = []
        }

        return {
            worker_id: worker.id,
            interview_completed: true,
            interview_transcript: [
                { role: 'assistant', content: `Hi ${worker.full_name}! Ready to discuss your pricing?` },
                { role: 'user', content: 'Yes, ready!' },
                { role: 'assistant', content: 'Great! This is seed data for testing.' }
            ],
            common_jobs: commonJobs,
            pricing_factors: pricingFactors,
            preferred_job_types: preferredJobTypes,
            avoided_job_types: avoidedJobTypes
        }
    })

// Insert AI profiles
    const { error } = await supabase
        .from('worker_ai_profiles')
        .upsert(aiProfiles, {
            onConflict: 'worker_id',
            ignoreDuplicates: false
        })

    if (error) {
        return { error: error.message }
    }

    return { count: aiProfiles.length, error: null }
}