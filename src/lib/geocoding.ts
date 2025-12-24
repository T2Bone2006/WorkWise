/**
 * UK Postcode Geocoding using postcodes.io API (free, no API key required)
 */

interface PostcodeResult {
    postcode: string
    latitude: number
    longitude: number
    admin_district: string | null
    region: string | null
}

interface PostcodesApiResponse {
    status: number
    result: {
        postcode: string
        latitude: number
        longitude: number
        admin_district: string | null
        region: string | null
    } | null
}

interface BulkPostcodesApiResponse {
    status: number
    result: Array<{
        query: string
        result: {
            postcode: string
            latitude: number
            longitude: number
            admin_district: string | null
            region: string | null
        } | null
    }>
}

/**
 * Geocode a single UK postcode
 * @param postcode - UK postcode (e.g., "M1 5BQ")
 * @returns Coordinates and location info, or null if not found
 */
export async function geocodePostcode(postcode: string): Promise<PostcodeResult | null> {
    if (!postcode) return null

    // Normalize postcode (remove spaces, uppercase)
    const normalizedPostcode = postcode.replace(/\s+/g, '').toUpperCase()

    try {
        const response = await fetch(
            `https://api.postcodes.io/postcodes/${encodeURIComponent(normalizedPostcode)}`,
            { next: { revalidate: 86400 } } // Cache for 24 hours
        )

        if (!response.ok) {
            console.warn(`Postcode lookup failed for ${postcode}: ${response.status}`)
            return null
        }

        const data: PostcodesApiResponse = await response.json()

        if (data.status !== 200 || !data.result) {
            console.warn(`Postcode not found: ${postcode}`)
            return null
        }

        return {
            postcode: data.result.postcode,
            latitude: data.result.latitude,
            longitude: data.result.longitude,
            admin_district: data.result.admin_district,
            region: data.result.region,
        }
    } catch (error) {
        console.error(`Error geocoding postcode ${postcode}:`, error)
        return null
    }
}

/**
 * Geocode multiple UK postcodes in a single API call (max 100)
 * @param postcodes - Array of UK postcodes
 * @returns Map of postcode -> coordinates
 */
export async function geocodePostcodes(postcodes: string[]): Promise<Map<string, PostcodeResult>> {
    const results = new Map<string, PostcodeResult>()

    if (!postcodes.length) return results

    // Normalize and dedupe postcodes
    const normalizedPostcodes = [...new Set(
        postcodes
            .filter(Boolean)
            .map(p => p.replace(/\s+/g, '').toUpperCase())
    )]

    // postcodes.io allows max 100 per request
    const batches: string[][] = []
    for (let i = 0; i < normalizedPostcodes.length; i += 100) {
        batches.push(normalizedPostcodes.slice(i, i + 100))
    }

    for (const batch of batches) {
        try {
            const response = await fetch('https://api.postcodes.io/postcodes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postcodes: batch }),
            })

            if (!response.ok) {
                console.warn(`Bulk postcode lookup failed: ${response.status}`)
                continue
            }

            const data: BulkPostcodesApiResponse = await response.json()

            if (data.status === 200 && data.result) {
                for (const item of data.result) {
                    if (item.result) {
                        results.set(item.query, {
                            postcode: item.result.postcode,
                            latitude: item.result.latitude,
                            longitude: item.result.longitude,
                            admin_district: item.result.admin_district,
                            region: item.result.region,
                        })
                    }
                }
            }
        } catch (error) {
            console.error('Error in bulk postcode geocoding:', error)
        }
    }

    return results
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in miles
 */
export function calculateDistanceMiles(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
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
