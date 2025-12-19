import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function PrivacyPage() {
    return (
        <main className="bg-background min-h-screen flex flex-col relative">
            <ThemeToggle className="absolute top-4 right-4" />
            <div className="container mx-auto px-6 py-24 max-w-4xl">
                <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

                <p className="text-muted-foreground mb-12">Last updated: {new Date().getFullYear()}</p>

                <section className="space-y-8 text-base leading-relaxed text-foreground">
                    <p>
                        Eden Technologies respects your privacy. This page explains what
                        information we collect, why we collect it, and how we handle it.
                    </p>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Who we are</h2>
                        <p>
                            Eden Technologies is a UK-based platform connecting tradespeople
                            with property managers and developers.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">What information we collect</h2>
                        <p>When you sign up or join the waitlist, we may collect:</p>
                        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                            <li>Your name</li>
                            <li>Email address</li>
                            <li>Trade type and experience</li>
                            <li>General location (city/region)</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Why we collect it</h2>
                        <p>We use this information to:</p>
                        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                            <li>Manage early access and onboarding</li>
                            <li>Notify you about launch updates</li>
                            <li>Match tradespeople to relevant jobs</li>
                            <li>Improve the platform as it develops</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">How your data is stored</h2>
                        <p>
                            Your data is stored securely using modern cloud infrastructure. We
                            do not sell your data or share it with third parties for marketing.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Emails</h2>
                        <p>
                            We may send important updates about Eden Technologies. You can opt
                            out of non-essential emails at any time.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Your rights</h2>
                        <p>
                            You can request access, correction, or deletion of your data at any
                            time by contacting us.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Contact</h2>
                        <p>
                            Questions about your data? Contact us at{" "}
                            <span className="font-medium">hello@edentechnologies.co.uk</span>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}
