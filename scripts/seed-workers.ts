import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables!')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const workers = [
    // ELECTRICIANS
    {
        email: 'james.parker@example.com',
        password: 'password123',
        full_name: 'James Parker',
        phone: '07700 900001',
        trade_type: 'electrician',
        hourly_rate: 45,
        day_rate: 320,
        base_postcode: 'M1 1AA',
        service_radius_miles: 15,
        travel_fee_per_mile: 0.45,
        certifications: { 'Part P': true, '18th Edition': true, 'NICEIC': true },
        status: 'active'
    },
    {
        email: 'michael.brown@example.com',
        password: 'password123',
        full_name: 'Michael Brown',
        phone: '07700 900002',
        trade_type: 'electrician',
        hourly_rate: 42,
        day_rate: 300,
        base_postcode: 'M2 2BB',
        service_radius_miles: 20,
        travel_fee_per_mile: 0.40,
        certifications: { 'Part P': true, '18th Edition': true },
        status: 'active'
    },
    {
        email: 'robert.davies@example.com',
        password: 'password123',
        full_name: 'Robert Davies',
        phone: '07700 900003',
        trade_type: 'electrician',
        hourly_rate: 38,
        day_rate: 280,
        base_postcode: 'M3 3CC',
        service_radius_miles: 10,
        travel_fee_per_mile: 0.50,
        certifications: { 'Part P': true },
        status: 'active'
    },
    {
        email: 'thomas.evans@example.com',
        password: 'password123',
        full_name: 'Thomas Evans',
        phone: '07700 900004',
        trade_type: 'electrician',
        hourly_rate: 50,
        day_rate: 360,
        base_postcode: 'M4 4DD',
        service_radius_miles: 25,
        travel_fee_per_mile: 0.40,
        certifications: { 'Part P': true, '18th Edition': true, 'NICEIC': true, 'ECS': true },
        status: 'active'
    },
    // PLUMBERS
    {
        email: 'david.harris@example.com',
        password: 'password123',
        full_name: 'David Harris',
        phone: '07700 900005',
        trade_type: 'plumber',
        hourly_rate: 40,
        day_rate: 300,
        base_postcode: 'M5 5EE',
        service_radius_miles: 15,
        travel_fee_per_mile: 0.45,
        certifications: { 'Gas Safe': true, 'City & Guilds': true },
        status: 'active'
    },
    {
        email: 'daniel.thomas@example.com',
        password: 'password123',
        full_name: 'Daniel Thomas',
        phone: '07700 900006',
        trade_type: 'plumber',
        hourly_rate: 44,
        day_rate: 320,
        base_postcode: 'M6 6FF',
        service_radius_miles: 20,
        travel_fee_per_mile: 0.40,
        certifications: { 'Gas Safe': true, 'City & Guilds': true, 'CIPHE': true },
        status: 'active'
    },
    {
        email: 'matthew.jones@example.com',
        password: 'password123',
        full_name: 'Matthew Jones',
        phone: '07700 900007',
        trade_type: 'plumber',
        hourly_rate: 38,
        day_rate: 280,
        base_postcode: 'M7 7GG',
        service_radius_miles: 12,
        travel_fee_per_mile: 0.50,
        certifications: { 'City & Guilds': true },
        status: 'active'
    },
    // CARPENTERS
    {
        email: 'paul.wilson@example.com',
        password: 'password123',
        full_name: 'Paul Wilson',
        phone: '07700 900008',
        trade_type: 'carpenter',
        hourly_rate: 36,
        day_rate: 260,
        base_postcode: 'M8 8HH',
        service_radius_miles: 18,
        travel_fee_per_mile: 0.45,
        certifications: { 'NVQ Level 3': true, 'CSCS': true },
        status: 'active'
    },
    {
        email: 'mark.taylor@example.com',
        password: 'password123',
        full_name: 'Mark Taylor',
        phone: '07700 900009',
        trade_type: 'carpenter',
        hourly_rate: 40,
        day_rate: 300,
        base_postcode: 'M9 9II',
        service_radius_miles: 15,
        travel_fee_per_mile: 0.40,
        certifications: { 'NVQ Level 3': true, 'CSCS': true, 'City & Guilds': true },
        status: 'active'
    },
    {
        email: 'andrew.martin@example.com',
        password: 'password123',
        full_name: 'Andrew Martin',
        phone: '07700 900010',
        trade_type: 'carpenter',
        hourly_rate: 34,
        day_rate: 250,
        base_postcode: 'M10 0JJ',
        service_radius_miles: 10,
        travel_fee_per_mile: 0.50,
        certifications: { 'NVQ Level 2': true, 'CSCS': true },
        status: 'active'
    },
    // PAINTERS
    {
        email: 'christopher.lee@example.com',
        password: 'password123',
        full_name: 'Christopher Lee',
        phone: '07700 900011',
        trade_type: 'painter',
        hourly_rate: 28,
        day_rate: 200,
        base_postcode: 'M11 1KK',
        service_radius_miles: 20,
        travel_fee_per_mile: 0.40,
        certifications: { 'NVQ Level 2': true, 'CSCS': true },
        status: 'active'
    },
    {
        email: 'anthony.white@example.com',
        password: 'password123',
        full_name: 'Anthony White',
        phone: '07700 900012',
        trade_type: 'painter',
        hourly_rate: 32,
        day_rate: 230,
        base_postcode: 'M12 2LL',
        service_radius_miles: 15,
        travel_fee_per_mile: 0.45,
        certifications: { 'NVQ Level 3': true, 'CSCS': true, 'City & Guilds': true },
        status: 'active'
    },
    {
        email: 'steven.clarke@example.com',
        password: 'password123',
        full_name: 'Steven Clarke',
        phone: '07700 900013',
        trade_type: 'painter',
        hourly_rate: 26,
        day_rate: 190,
        base_postcode: 'M13 3MM',
        service_radius_miles: 12,
        travel_fee_per_mile: 0.50,
        certifications: { 'NVQ Level 2': true },
        status: 'active'
    },
    // BUILDERS
    {
        email: 'kevin.wright@example.com',
        password: 'password123',
        full_name: 'Kevin Wright',
        phone: '07700 900014',
        trade_type: 'builder',
        hourly_rate: 42,
        day_rate: 320,
        base_postcode: 'M14 4NN',
        service_radius_miles: 20,
        travel_fee_per_mile: 0.45,
        certifications: { 'NVQ Level 3': true, 'CSCS': true, 'CITB': true },
        status: 'active'
    },
    {
        email: 'brian.robinson@example.com',
        password: 'password123',
        full_name: 'Brian Robinson',
        phone: '07700 900015',
        trade_type: 'builder',
        hourly_rate: 38,
        day_rate: 290,
        base_postcode: 'M15 5OO',
        service_radius_miles: 15,
        travel_fee_per_mile: 0.40,
        certifications: { 'NVQ Level 2': true, 'CSCS': true },
        status: 'active'
    },
    // GAS ENGINEERS
    {
        email: 'gary.walker@example.com',
        password: 'password123',
        full_name: 'Gary Walker',
        phone: '07700 900016',
        trade_type: 'gas_engineer',
        hourly_rate: 48,
        day_rate: 360,
        base_postcode: 'M16 6PP',
        service_radius_miles: 25,
        travel_fee_per_mile: 0.40,
        certifications: { 'Gas Safe': true, 'ACS': true, 'OFTEC': true },
        status: 'active'
    },
    {
        email: 'jason.hall@example.com',
        password: 'password123',
        full_name: 'Jason Hall',
        phone: '07700 900017',
        trade_type: 'gas_engineer',
        hourly_rate: 46,
        day_rate: 340,
        base_postcode: 'M17 7QQ',
        service_radius_miles: 20,
        travel_fee_per_mile: 0.45,
        certifications: { 'Gas Safe': true, 'ACS': true },
        status: 'active'
    },
    // ROOFERS
    {
        email: 'ryan.allen@example.com',
        password: 'password123',
        full_name: 'Ryan Allen',
        phone: '07700 900018',
        trade_type: 'roofer',
        hourly_rate: 40,
        day_rate: 300,
        base_postcode: 'M18 8RR',
        service_radius_miles: 18,
        travel_fee_per_mile: 0.45,
        certifications: { 'NFRC': true, 'CSCS': true },
        status: 'active'
    },
    {
        email: 'adam.king@example.com',
        password: 'password123',
        full_name: 'Adam King',
        phone: '07700 900019',
        trade_type: 'roofer',
        hourly_rate: 44,
        day_rate: 330,
        base_postcode: 'M19 9SS',
        service_radius_miles: 22,
        travel_fee_per_mile: 0.40,
        certifications: { 'NFRC': true, 'CSCS': true, 'CITB': true },
        status: 'active'
    },
    // PLASTERERS
    {
        email: 'jonathan.scott@example.com',
        password: 'password123',
        full_name: 'Jonathan Scott',
        phone: '07700 900020',
        trade_type: 'plasterer',
        hourly_rate: 36,
        day_rate: 270,
        base_postcode: 'M20 0TT',
        service_radius_miles: 15,
        travel_fee_per_mile: 0.45,
        certifications: { 'NVQ Level 2': true, 'CSCS': true },
        status: 'active'
    },
    {
        email: 'nathan.green@example.com',
        password: 'password123',
        full_name: 'Nathan Green',
        phone: '07700 900021',
        trade_type: 'plasterer',
        hourly_rate: 40,
        day_rate: 300,
        base_postcode: 'M21 1UU',
        service_radius_miles: 20,
        travel_fee_per_mile: 0.40,
        certifications: { 'NVQ Level 3': true, 'CSCS': true, 'City & Guilds': true },
        status: 'active'
    }
]

async function seedWorkers() {
    console.log('🌱 Starting worker seed...')

    let created = 0
    let skipped = 0
    let fixed = 0

    for (const worker of workers) {
        try {
            // Check if worker profile exists (not just auth)
            const { data: existingWorker } = await supabase
                .from('workers')
                .select('id')
                .eq('email', worker.email)
                .single()

            if (existingWorker) {
                console.log(`⏭️  Skipped ${worker.full_name} (profile exists)`)
                skipped++
                continue
            }

            // Try to get existing auth user
            const { data: { users } } = await supabase.auth.admin.listUsers()
            const existingAuthUser = users.find(u => u.email === worker.email)

            let authUserId: string

            if (existingAuthUser) {
                // Auth exists but profile doesn't - use existing auth user
                console.log(`🔧 Fixing ${worker.full_name} (auth exists, creating profile)`)
                authUserId = existingAuthUser.id
                fixed++
            } else {
                // Create new auth user
                const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                    email: worker.email,
                    password: worker.password,
                    email_confirm: true,
                    user_metadata: { role: 'worker' }
                })

                if (authError) {
                    console.log(`❌ Auth failed for ${worker.full_name}:`, authError.message)
                    continue
                }

                authUserId = authData.user.id
                console.log(`✅ Created auth for ${worker.full_name}`)
            }

            // Create worker profile
            const { error: workerError } = await supabase
                .from('workers')
                .insert({
                    id: authUserId,
                    email: worker.email,
                    full_name: worker.full_name,
                    phone: worker.phone,
                    trade_type: worker.trade_type,
                    hourly_rate: worker.hourly_rate,
                    day_rate: worker.day_rate,
                    base_postcode: worker.base_postcode,
                    service_radius_miles: worker.service_radius_miles,
                    travel_fee_per_mile: worker.travel_fee_per_mile,
                    certifications: worker.certifications,
                    status: worker.status,
                    user_id: authUserId
                })

            if (workerError) {
                console.log(`❌ Worker profile failed for ${worker.full_name}:`, workerError.message)
                continue
            }

            // Create AI profile
            const { error: aiError } = await supabase
                .from('worker_ai_profiles')
                .insert({
                    worker_id: authUserId,
                    interview_completed: true,
                    common_jobs: [
                        { type: 'standard_repair', typical_duration: '2-3 hours', typical_price: worker.hourly_rate * 2.5 },
                        { type: 'installation', typical_duration: '4-6 hours', typical_price: worker.hourly_rate * 5 }
                    ],
                    pricing_factors: {
                        emergency_multiplier: 1.5,
                        callout_fee: 30,
                        prefers_day_rate_for: ['large_projects'],
                        prefers_hourly_for: ['small_repairs']
                    }
                })

            if (aiError) {
                console.log(`⚠️  AI profile warning for ${worker.full_name}:`, aiError.message)
            }

            if (!existingAuthUser) {
                created++
            }

        } catch (error) {
            console.log(`❌ Error creating ${worker.full_name}:`, error)
        }
    }

    console.log(`\n✅ Worker seed complete!`)
    console.log(`   Created: ${created}`)
    console.log(`   Fixed: ${fixed}`)
    console.log(`   Skipped: ${skipped}`)
    console.log(`   Total: ${workers.length}`)
}

seedWorkers()