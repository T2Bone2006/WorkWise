export default function TermsPage() {
    return (
        <main className="bg-background min-h-screen flex flex-col">
            <div className="container mx-auto px-6 py-24 max-w-4xl">
                <h1 className="text-4xl font-bold text-foreground mb-8">Terms & Conditions</h1>

                <p className="text-muted-foreground mb-12">Last updated: {new Date().getFullYear()}</p>

                <section className="space-y-8 text-base leading-relaxed text-foreground">
                    <p>
                        These terms explain how Eden Technologies works and what you agree
                        to when using our platform.
                    </p>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Early-stage platform</h2>
                        <p>
                            Eden Technologies is currently in development and early access.
                            Features may change, be added, or removed as the platform evolves.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Our role</h2>
                        <p>
                            We provide a platform to connect tradespeople with property managers
                            and developers. We are not a party to any agreements between users.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">No guarantees</h2>
                        <p>We do not guarantee:</p>
                        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                            <li>A minimum number of jobs</li>
                            <li>Specific earnings or outcomes</li>
                            <li>Availability of clients in all areas</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Fees</h2>
                        <p>
                            Eden Technologies is currently free for tradespeople. Any future
                            changes will be communicated clearly in advance.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">User responsibility</h2>
                        <p>
                            Users are responsible for their own communications, agreements, and
                            work. Always carry out appropriate checks before accepting or
                            offering work.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Liability</h2>
                        <p>
                            To the extent permitted by law, Eden Technologies is not liable for
                            disputes, losses, or damages arising from work arranged through
                            the platform.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Changes to these terms</h2>
                        <p>
                            We may update these terms from time to time. Continued use means
                            you accept the latest version.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Contact</h2>
                        <p>
                            Questions about these terms? Contact us at{" "}
                            <span className="font-medium">hello@edentechnologies.co.uk</span>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}
