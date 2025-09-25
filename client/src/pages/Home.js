import Footer from "../components/Footer"
import Hero from "./sections/Hero"
import FeaturedGroups from "../components/FeaturedGroups"
import NewsletterSignup from "../components/NewsletterSignup"


export default function LandingPage() {
    return (
        <main style={{background:'var(--bg)', minHeight:'100vh', minWidth: '100dvw'}}>
            <section>
                    <Hero />
                </section>
                <section style={{padding:'1rem 0'}}>
                    <FeaturedGroups />
                </section>
                {/* AboutUs moved to /learnmore (LearnMore page). */}
                <section style={{padding:'1rem 0'}}>
                    <NewsletterSignup />
                </section>
            <Footer />
        </main>
    )
}