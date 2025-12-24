import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { geocodePostcode } from '@/lib/geocoding'

export async function POST() {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!adminData) {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get all workers missing coordinates but have a postcode
    const { data: workers, error: fetchError } = await supabase
        .from('workers')
        .select('id, base_postcode, postcode, base_latitude, base_longitude')
        .or('base_latitude.is.null,base_longitude.is.null')

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!workers || workers.length === 0) {
        return NextResponse.json({ message: 'No workers need geocoding', updated: 0 })
    }

    let updated = 0
    let failed = 0
    const errors: string[] = []

    for (const worker of workers) {
        // Use base_postcode or postcode
        const postcode = worker.base_postcode || worker.postcode
        if (!postcode) {
            failed++
            errors.push(`Worker ${worker.id}: No postcode available`)
            continue
        }

        try {
            const result = await geocodePostcode(postcode)
            if (result) {
                const { error: updateError } = await supabase
                    .from('workers')
                    .update({
                        base_latitude: result.latitude,
                        base_longitude: result.longitude,
                        // Also sync postcodes if one is missing
                        postcode: postcode,
                        base_postcode: postcode,
                    })
                    .eq('id', worker.id)

                if (updateError) {
                    failed++
                    errors.push(`Worker ${worker.id}: ${updateError.message}`)
                } else {
                    updated++
                }
            } else {
                failed++
                errors.push(`Worker ${worker.id}: Could not geocode postcode ${postcode}`)
            }
        } catch (err) {
            failed++
            errors.push(`Worker ${worker.id}: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }

        // Rate limit: postcodes.io allows 10 requests/second for free tier
        await new Promise(resolve => setTimeout(resolve, 150))
    }

    return NextResponse.json({
        message: `Geocoded ${updated} workers`,
        updated,
        failed,
        errors: errors.slice(0, 10), // Only return first 10 errors
    })
}
