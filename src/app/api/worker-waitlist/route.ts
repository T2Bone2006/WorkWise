import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import {
    getWorkerConfirmationEmail,
    getWorkerReferralEmail
} from "@/lib/emails/worker-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            full_name,
            email,
            phone,
            trade_type,
            postcode,
            years_experience,
            has_insurance,
            has_vehicle,
        } = body;

        // Validate required fields
        if (!full_name || !email || !phone || !trade_type || !postcode) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create Supabase client
        const supabase = await createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Insert into worker_waitlist table
        const { data, error } = await supabase
            .from("worker_waitlist")
            .insert({
                full_name,
                email,
                phone,
                trade_type,
                postcode,
                status: "waitlist",
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json(
                { error: "Failed to join waitlist. This email may already be registered." },
                { status: 500 }
            );
        }

        // Check if Resend API key exists
        if (!process.env.RESEND_API_KEY) {
            console.error("❌ RESEND_API_KEY not found in environment variables!");
        } else {
            console.log("✅ Resend API key found");
        }

        // Send both emails
        try {
            console.log("📧 Preparing to send emails to:", email);

            const confirmationHtml = getWorkerConfirmationEmail(
                full_name,
                trade_type,
                postcode
            );

            const referralHtml = getWorkerReferralEmail(
                full_name,
                trade_type
            );

            // Send confirmation email
            console.log("📤 Sending confirmation email...");
            const confirmResult = await resend.emails.send({
                from: "WorkWise <workwise@edentechnologies.co.uk>",
                to: [email],
                subject: "Welcome to WorkWise - You're on the waitlist! 🎉",
                html: confirmationHtml,
            });

            console.log("✅ Confirmation email sent:", confirmResult);

            // Send referral email immediately (no timeout)
            console.log("📤 Sending referral email...");
            const referralResult = await resend.emails.send({
                from: "WorkWise <workwise@edentechnologies.co.uk>",
                to: [email],
                subject: "Help us grow - Forward this to other tradespeople",
                html: referralHtml,
            });

            console.log("✅ Referral email sent:", referralResult);

        } catch (emailError) {
            console.error("❌ Email error:", emailError);
            // Log the full error details
            if (emailError instanceof Error) {
                console.error("Error message:", emailError.message);
                console.error("Error stack:", emailError.stack);
            }
            // Don't fail the whole request if email fails
        }

        return NextResponse.json(
            {
                success: true,
                message: "Successfully joined waitlist",
                data
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("❌ API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
