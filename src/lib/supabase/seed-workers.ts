'use server'

import { createClient } from './server'

export async function seedWorkers() {
    const supabase = await createClient()

    const workers = [
        {
            full_name: "John Mitchell",
            email: "john.mitchell@example.com",
            phone: "07700 900123",
            trade_type: "electrician",
            day_rate: 250.00,
            hourly_rate: 35.00,
            base_postcode: "M1 5BQ",
            base_latitude: 53.4808,
            base_longitude: -2.2426,
            service_radius_miles: 15.00,
            travel_fee_per_mile: 2.00,
            certifications: {
                "NIC EIC": { number: "NIC123456", expiry: "2026-06-01" },
                "Part P": { number: "PARTP789", expiry: "2026-03-15" }
            },
            status: "active"
        },
        {
            full_name: "Sarah Thompson",
            email: "sarah.thompson@example.com",
            phone: "07700 900456",
            trade_type: "plumber",
            day_rate: 275.00,
            hourly_rate: 40.00,
            base_postcode: "M20 3LJ",
            base_latitude: 53.4100,
            base_longitude: -2.2500,
            service_radius_miles: 20.00,
            travel_fee_per_mile: 1.50,
            certifications: {
                "Gas Safe": { number: "GAS987654", expiry: "2026-12-01" }
            },
            status: "active"
        },
        {
            full_name: "David Roberts",
            email: "david.roberts@example.com",
            phone: "07700 900789",
            trade_type: "electrician",
            day_rate: 280.00,
            hourly_rate: 38.00,
            base_postcode: "M4 4BF",
            base_latitude: 53.4831,
            base_longitude: -2.2338,
            service_radius_miles: 12.00,
            travel_fee_per_mile: 2.50,
            certifications: {
                "NIC EIC": { number: "NIC789012", expiry: "2025-09-20" },
                "Part P": { number: "PARTP345", expiry: "2025-08-10" },
                "18th Edition": { number: "18ED567", expiry: "2027-01-15" }
            },
            status: "active"
        },
        {
            full_name: "Emma Wilson",
            email: "emma.wilson@example.com",
            phone: "07700 900234",
            trade_type: "plumber",
            day_rate: 260.00,
            hourly_rate: 36.00,
            base_postcode: "M15 6AZ",
            base_latitude: 53.4668,
            base_longitude: -2.2581,
            service_radius_miles: 18.00,
            travel_fee_per_mile: 1.75,
            certifications: {
                "Gas Safe": { number: "GAS456789", expiry: "2026-04-15" },
                "Unvented Hot Water": { number: "UHW123", expiry: "2025-11-30" }
            },
            status: "active"
        },
        {
            full_name: "Michael Davies",
            email: "michael.davies@example.com",
            phone: "07700 900567",
            trade_type: "carpenter",
            day_rate: 220.00,
            hourly_rate: 30.00,
            base_postcode: "M8 8EP",
            base_latitude: 53.5100,
            base_longitude: -2.2400,
            service_radius_miles: 25.00,
            travel_fee_per_mile: 1.00,
            certifications: {
                "CSCS": { number: "CSCS123456", expiry: "2026-08-20" }
            },
            status: "active"
        },
        {
            full_name: "Lisa Anderson",
            email: "lisa.anderson@example.com",
            phone: "07700 900890",
            trade_type: "electrician",
            day_rate: 265.00,
            hourly_rate: 37.00,
            base_postcode: "M3 3EB",
            base_latitude: 53.4900,
            base_longitude: -2.2500,
            service_radius_miles: 16.00,
            travel_fee_per_mile: 2.00,
            certifications: {
                "NIC EIC": { number: "NIC345678", expiry: "2027-02-10" },
                "Part P": { number: "PARTP901", expiry: "2026-12-25" }
            },
            status: "active"
        }
    ]

    const { data, error } = await supabase
        .from('workers')
        .insert(workers)
        .select()

    if (error) {
        console.error('Error seeding workers:', error)
        return { error: error.message }
    }

    return { data, count: workers.length }
}